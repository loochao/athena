import json
import pymongo
import mongoDbClient

from bson import BSON
from bson import json_util

def addTransaction(user, date, type, symbol, price, shares):
    db = mongoDbClient.getDB()
    db.transaction.insert({"user" : user, "date" : date, "type" : type, "symbol" : symbol, "price" : price, "shares" : shares})
    return 'success'

def listAllTransactions(user):
    db = mongoDbClient.getDB()
    #transactions = list(db.transaction.find({ "user" : user}))
    transactions = list(db.transaction.find())
    return json.dumps(transactions, sort_keys=True, indent=4, default=json_util.default)

def getPortfolio(user):
    db = mongoDbClient.getDB()
    #portfolio = db.getPortfolio().find({ "user" : user })
    portfolio = list(db.portfolio.find())
    return json.dumps(portfolio, sort_keys=True, indent=4, default=json_util.default)

def addStockToPortfolio(user, symbol, cost, shares):
    db = mongoDbClient.getDB()
    #portfolio = db.portfolio.find({ "user" : user });
    portfolio = list(db.portfolio.find())
    if len(portfolio) == 0:
        # user doesn't own any shares before
        print "length == 0"
    else:
        # user owns some shares
        print "length > 0"
    
addStockToPortfolio("123", "AMZN", "560", "20")