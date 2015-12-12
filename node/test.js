var express    = require("express");
var mysql      = require("mysql");

var pool       = mysql.createPool({
    connectionLimit : 100,
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'athena',
    debug : false
})

var app = express();


function handle_database(req, res) {
    pool.getConnection(function(err, connection) {
        if (err) {
            connection.release();
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
        }
        
        console.log('connected as id ' + connection.threadId);
        
        connection.query("select * from user", function(err, rows) {
            connection.release();
            if (!err) {
                res.json(rows);
            }
        });
        
        connection.on('error', function(err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
        });
    });
}

app.get("/", function(req, res) {
    handle_database(req, res);
    res.send("hello!");
})

app.listen(8000);
console.log("Listening on 8000...");