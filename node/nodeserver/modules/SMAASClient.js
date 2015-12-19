var rpc = require('node-json-rpc');

var options = {
  // int port of rpc server
  port: 4040,
  // string domain name or ip of rpc server, default '127.0.0.1' 
  host: '127.0.0.1',
  // string with default path, default '/' 
  path: '/',
  // boolean false to turn rpc checks off, default true 
  strict: true
};
 
// Create a server object with options

// addTransaction(date, type, symbol, price, shares)
function addTransaction(date, type, symbol, price, shares) {
    var client = new rpc.Client(options);
    var request = {
        "jsonrps" : "2.0",
        "method" : "addTransaction",
        "params" : [date, type, symbol, price, shares]
    };
    
    return client.call(request, function (err, res) {
        if (err) { console.log(err); }
        else { console.log(res); }
  });
}

function listAllTransactions() {
    var client = new rpc.Client(options);
    var request = {
        "jsonrps" : "2.0",
        "method" : "listAllTransactions",
        "params" : []
    };
    return client.call(request)
}

module.exports = {
    addTransaction : addTransaction,
    listAllTransactions : listAllTransactions
};
