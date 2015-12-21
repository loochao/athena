var jayson = require('jayson');

// create a server
var server = jayson.server({
  add: function(a, b, callback) {
      console.log("a: " + a + "b: " + b);
    callback(null, a + b);
  }
});

// Bind a http interface to the server and let it listen to localhost:4040
server.http().listen(4040);