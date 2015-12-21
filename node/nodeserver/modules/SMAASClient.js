var jayson = require('jayson');

// create a client
var client = jayson.client.http({
  port: 4040,
  hostname: 'localhost'
});

// invoke "add"
function add(a, b, callback) {
    client.request('add', [a, b], function(err, error, response) {
        if(err) throw err;
//        console.log(response);
        callback(response);
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
function listAllTransactions(callback) {
    client.request('listAllTransactions', [], function(err, error, response) {
        if(err) throw err;
//        console.log(response);
        callback(response);
    });
}

// Test
//var list = listAllTransactions();
//console.log(list);

/*
var sum = add(2, 4, function(response) {
    console.log(response);
});

var list = listAllTransactions(function(response) {
    console.log(response);
})
*/

module.exports = {
    addTransaction : addTransaction,
    listAllTransactions : listAllTransactions
};

