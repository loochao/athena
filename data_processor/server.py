import json
import pyjsonrpc
import pymongo
from bson import BSON
from bson import json_util

server_host = 'localhost'
server_port = 4040

def getDB():
    from pymongo import MongoClient
    client = MongoClient('localhost:27017')
    db = client.athena
    return db

class RequestHandler(pyjsonrpc.HttpRequestHandler):

    @pyjsonrpc.rpcmethod
    def add(self, a, b):
        """Test method"""
        return a + b

    @pyjsonrpc.rpcmethod
    def addTransaction(self, date, type, symbol, price, shares):
        print "addTransaction gets called with params: [date : %s, type : %s, symbol : %s, price : %s, shares : %s] " % (str(date), str(type), str(symbol), str(price), str(shares))
        db = getDB()
        db.transaction.insert({"date" : date, "type" : type, "symbol" : symbol, "price" : price, "shares" : shares})
        return 'success'

    @pyjsonrpc.rpcmethod
    def listAllTransactions(self):
        print "listAllTransactions gets called"
        db = getDB()
        transactions = list(db.transaction.find())
        return json.dumps(transactions, sort_keys=True, indent=4, default=json_util.default)

# Threading HTTP-Server
http_server = pyjsonrpc.ThreadingHttpServer(
    server_address = (server_host, server_port),
    RequestHandlerClass = RequestHandler
)
print "Starting HTTP server ..."
print "URL: http://" + server_host + ":" + str(server_port)

http_server.serve_forever()