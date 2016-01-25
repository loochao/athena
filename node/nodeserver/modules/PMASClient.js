var jayson = require('jayson');

// create a client
var client = jayson.client.http({
  port: 4040,
  hostname: 'localhost'
});

function add(a, b, callback) {
    client.request('add', [a, b], function(err, error, response) {
        if (err) throw err;
//        console.log(response);
        callback(response);
    });
}

function listAccounts(user, callback) {
    client.request('listAccounts', [user], function(err, error, response) {
        if (err) throw err;
//        console.log(response);
        callback(response);
    });
}

function addAccount(user, account, callback) {
    client.request('addAccount', [user, account], function(err, error, response) {
        if (err) throw err;
//        console.log(response);
        callback(response);
    });
}

function addTransaction(user, account, date, type, symbol, price, shares, callback) {
    client.request('addTransaction', [user, account, date, type, symbol, price, shares], function(err, error, response) {
        if (err) throw err;
//        console.log(response);
        callback(response);
    });
}

function listAllTransactions(user, callback) {
    client.request('listAllTransactions', [user], function(err, error, response) {
        if (err) throw err;
//        console.log(response);
        callback(response);
    });
}

function listTransactionsByAccount(user, account, callback) {
    client.request('listTransactionsByAccount', [user, account], function(err, error, response) {
        if (err) throw err;
//        console.log(response);
        callback(response);
    });
}

function getPortfolio(user, callback) {
    client.request('getPortfolio', [user], function(err, error, response) {
        if (err) throw err;
//        console.log(response);
        callback(response);
    });
}

function updatePortfolioForUser(user, callback) {
    client.request('updatePortfolioForUser', [user], function(err, error, response) {
        if (err) throw err;
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
    listAllTransactions : listAllTransactions,
    listTransactionsByAccount : listTransactionsByAccount,
    getPortfolio : getPortfolio,
    updatePortfolioForUser : updatePortfolioForUser,
    listAccounts : listAccounts,
    addAccount : addAccount
};

