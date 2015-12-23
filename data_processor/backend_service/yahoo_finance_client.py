from yahoo_finance import Share

def getStockInfo(symbol):
    yahoo_finance_client = Share(symbol)

    stock_info = {}
    stock_info["price"] = yahoo_finance_client.get_price()
    stock_info["change"] = yahoo_finance_client.get_change()

    return stock_info

