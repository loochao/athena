import json
import pyjsonrpc
import pymongo

from bson import BSON
from bson import json_util

import operations
import mongoDbClient

server_host = 'localhost'
server_port = 4040

class RequestHandler(pyjsonrpc.HttpRequestHandler):

    @pyjsonrpc.rpcmethod
    def add(self, a, b):
        """Test method"""
        return a + b

    @pyjsonrpc.rpcmethod
    def addTransaction(self, user, date, type, symbol, price, shares):
        print "addTransaction gets called with params: [date : %s, type : %s, symbol : %s, price : %s, shares : %s] " % (str(date), str(type), str(symbol), str(price), str(shares))
        return operations.addTransaction(user, date, type, symbol, price, shares)

    @pyjsonrpc.rpcmethod
    def listAllTransactions(self, user):
        print "listAllTransactions gets called"
        return operations.listAllTransactions(user)

    @pyjsonrpc.rpcmethod
    def getPortfolio(self, user):
        print "getPortfolio gets called"
        return operations.getPortfolio(user)

# Threading HTTP-Server
http_server = pyjsonrpc.ThreadingHttpServer(
    server_address = (server_host, server_port),
    RequestHandlerClass = RequestHandler
)
print "Starting HTTP server ..."
print "URL: http://" + server_host + ":" + str(server_port)

http_server.serve_forever()