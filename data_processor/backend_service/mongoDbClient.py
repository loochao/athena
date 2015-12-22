from pymongo import MongoClient

def getDB():
    client = MongoClient('localhost:27017')
    db = client.athena
    return db