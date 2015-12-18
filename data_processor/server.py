import pyjsonrpc
import pymongo

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
        db = getDB()
        db.transaction.insert({"date" : date, "type" : type, "symbol" : symbol, "price" : price, "shares" : shares})
        return 'success'


# Threading HTTP-Server
http_server = pyjsonrpc.ThreadingHttpServer(
    server_address = (server_host, server_port),
    RequestHandlerClass = RequestHandler
)
print "Starting HTTP server ..."
print "URL: http://" + server_host + ":" + str(server_port)

http_server.serve_forever()