var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var mysql = require('mysql');
require('dotenv').config();

var checkdb = require("./checkdb.js");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// gets the html file and puts it up 
//(this file works both as server and for database)
app.get('/',function(req,res,next){
    res.sendFile('index.html', {root: '/Users/ginak/Desktop/TextTask/public'});
});

// from the form tag, puts in the data
app.post('/thankyou', function(req, res) {
    res.sendFile('thankyou.html', {root: '/Users/ginak/Desktop/TextTask/public'});

    console.log(req.body);

    // connects to sql db
    var con = mysql.createConnection({
        host: process.env.HOST,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE,
    });

    con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    var sql = "INSERT INTO userinfo (Name, Task, Phone, Time) VALUES ('"+req.body.Name+"','"+req.body.Task+"','"+req.body.Phone+"','"+req.body.Time+"')";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
    });
    });
});

checkdb.checkTime();

app.listen(8080, function() {
  console.log('Listening at: localhost:8080');
});
