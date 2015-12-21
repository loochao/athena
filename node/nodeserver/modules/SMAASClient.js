var jayson = require('jayson');

// create a client
var client = jayson.client.http({
  port: 4040,
  hostname: 'localhost'
});

// invoke "add"
function add(a, b) {
    client.request('add', [a, b], function(err, error, response) {
        if(err) throw err;
//        console.log(response);
        return response;
    });
}

// addTransaction(date, type, symbol, price, shares)
function addTransaction(date, type, symbol, price, shares) {
    client.request('addTransaction', [date, type, symbol, price, shares], function(err, error, response) {
        if(err) throw err;
//        console.log(response);
        return response;
    });
}


// listAllTransactions
function listAllTransactions() {
    client.request('listAllTransactions', [], function(err, error, response) {
        if(err) throw err;
//        console.log(response);
        return response;
    });
}

var list = listAllTransactions();
console.log(list);

module.exports = {
    addTransaction : addTransaction,
    listAllTransactions : listAllTransactions
};

