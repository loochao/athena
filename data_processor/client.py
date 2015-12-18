import pyjsonrpc

http_client = pyjsonrpc.HttpClient(
    url = "http://localhost:4040"
)
'''
print http_client.call("add", 4, 2)
# Result: 6

# It is also possible to use the *method* name as *attribute* name.
print http_client.add(1, 2)
# Result: 3

# Notifications send messages to the server, without response.
http_client.notify("add", 3, 4)
'''

# addTransaction(date, type, symbol, price, shares)
print http_client.addTransaction("20151216", "buy", "AMZN", "570.2", "20");