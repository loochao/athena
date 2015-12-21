var jayson = require('jayson');

// create a client
var client = jayson.client.http({
  port: 4040,
  hostname: 'localhost'
});

// invoke "add"
client.request('add', [1, 1], function(err, error, response) {
  if(err) throw err;
  console.log(response); // 2!
});

client.request('listAllTransactions', [], function(err, error, response) {
  if(err) throw err;
  console.log(response); // 2!
});