import json
import pymongo
import mongoDbClient
import yahoo_finance_client

from bson import BSON
from bson import json_util

def addTransaction(user, account, date, type, symbol, price, shares):
    db = mongoDbClient.getDB()
    try:
        if type == "buy":
            buyStockToPortfolio(user, account, symbol, price, shares)
        elif type == "sell":
            sellStockFromPortfolio(user, account, symbol, price, shares)
        db.transaction.insert({"user" : user, "account" : account, "date" : date, "type" : type, "symbol" : symbol, "price" : price, "shares" : shares})
    except Exception as e:
        print "Failed to add transaction due to " + str(e)
        return "error: Failed to add transaction due to " + str(e)

    return 'success'

def listAllTransactions(user):
    db = mongoDbClient.getDB()
    transactions = list(db.transaction.find({ "user" : user }))
    return json.dumps(transactions, sort_keys=True, indent=4, default=json_util.default)

def listAllTransactionsByAccount(user, account):
    db = mongoDbClient.getDB()
    transactions = list(db.transaction.find({ "user" : user, "account" : account }))
    return json.dumps(transactions, sort_keys=True, indent=4, default=json_util.default)

def getPortfolio(user):
    db = mongoDbClient.getDB()
    portfolio_list = list(db.portfolio.find({ "user" : user }))
    if len(portfolio_list) > 0:
        return json.dumps(portfolio_list[0], sort_keys=True, indent=4, default=json_util.default)
    else:
        return None

def buyStockToPortfolio(user, account, symbol, cost, shares):
    db = mongoDbClient.getDB()
    portfolio_list = list(db.portfolio.find({ "user" : user, "account" : account }))
    if len(portfolio_list) == 0:
        # user doesn't own any shares before
        new_portfolio = { 
            "user" : user,
            "account" : account,
            "stocks" : [ 
                { 
                    "symbol" : symbol, 
                    "shares" : shares, 
                    "averageCost" : cost
                }
            ]
        }
        updated_portfolio = updatePortfolio(new_portfolio)
        db.portfolio.insert(updated_portfolio)
    else:
        portfolio = portfolio_list[0]   # should be only one
        is_stock_found = False
        for stock in portfolio["stocks"]:
            # user owns some shares
            if stock["symbol"] == symbol:
                is_stock_found = True
                cost = convert_to_float(cost)
                shares = convert_to_float(shares)
                pre_average_cost = convert_to_float(stock["averageCost"])
                pre_shares = convert_to_float(stock["shares"])
                average_cost = (pre_average_cost * pre_shares + cost * shares) / (pre_shares + shares)
                stock["shares"] = pre_shares + shares
                stock["averageCost"] = average_cost
                break

        if is_stock_found == False:
            portfolio["stocks"].append({
                "symbol" : symbol,
                "shares" : shares,
                "averageCost" : cost
                })

        updated_portfolio = updatePortfolio(portfolio)
        db.portfolio.replace_one({ "user" : user, "account" : account }, updated_portfolio)

def sellStockFromPortfolio(user, account, symbol, sell_price, shares):
    db = mongoDbClient.getDB()
    portfolio_list = list(db.portfolio.find({ "user" : user, "account" : account }))
    if len(portfolio_list) == 0:
        # user doesn't own any shares before
        raise Exception("user/account doesn't own shares of " + symbol)
    else:
        portfolio = portfolio_list[0]   # should be only one
        is_stock_found = False
        for stock in portfolio["stocks"]:
            # user owns some shares
            if stock["symbol"] == symbol:
                is_stock_found = True
                sell_shares = convert_to_float(shares)
                pre_shares = convert_to_float(stock["shares"])
                if sell_shares > pre_shares:
                    raise Exception("user doesn't own ENOUGH shares of " + symbol)
                elif sell_shares < pre_shares:
                    stock["shares"] = pre_shares - sell_shares
                else:   # sell all owned shares
                    portfolio["stocks"].remove(stock)
                break

        if is_stock_found == False:
            raise Exception("user/account doesn't own shares of " + symbol)

        updated_portfolio = updatePortfolio(portfolio)
        db.portfolio.replace_one({ "user" : user, "account" : account }, updated_portfolio)

def updatePortfolioForUser(user):
    db = mongoDbClient.getDB()
    portfolio_list = list(db.portfolio.find({ "user" : user }))
    if len(portfolio_list) == 0:
        # user doesn't have a portfolio
        print "user doesn't have a portfolio"
    else:
        updatePortfolio(portfolio_list[0])   # should be only one
    return

def updatePortfolio(portfolio):
    stocklist = portfolio["stocks"]
    for stock in stocklist:
        yahoo_stock_info = yahoo_finance_client.getStockInfo(stock["symbol"])
        price = convert_to_float(yahoo_stock_info["price"])
        average_cost = convert_to_float(stock["averageCost"])
        change = convert_to_float(yahoo_stock_info["change"])
        shares = convert_to_float(stock["shares"])
        equity = price * shares
        total_cost = shares * average_cost
        total_return_val = equity - total_cost
        most_recent_day_return_value = shares * change

        stock["price"] = round(price, 2)
        stock["equity"] = round(equity, 2)
        stock["mostRecentDayReturnValue"] = round(most_recent_day_return_value, 2)
        stock["mostRecentDayReturnPercent"] = round(most_recent_day_return_value / total_cost, 2)
        stock["totalReturnValue"] = round(total_return_val, 2)
        stock["totalReturnPercent"] = round(total_return_val / total_cost, 2)

    return portfolio

def listAccounts(user):
    db = mongoDbClient.getDB()
    accounts = list(db.accounts.find({ "user" : user }))
    return json.dumps(accounts, sort_keys=True, indent=4, default=json_util.default)

def addAccount(user, account):
    db = mongoDbClient.getDB()
    new_account = {
        "user" : user,
        "account" : account
    }
    db.accounts.insert(new_account)

def convert_to_float(value):
    try:
        return float(value)
    except:
        return 0.0
