'use strict'
var mysql = require ('mysql');
var express = require('express');
var bodyParser = require('body-parser');
var moment = require('moment');
var app = express();
var connection = mysql.createConnection ({
    host:   '127.0.0.1',
    user:   'vagrant',
    password:   '',
    database:   'twatter'
    });

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));
app.use (bodyParser.urlencoded({extended:   true}));

connection.connect(function (err)   {
    if(err){
        console.log(err);
        return;
        }

    console.log('Connected to the DB');
    });

console.log ('Hello World');



app.get('/', function(req, res) {
    var query = 'SELECT * FROM Twats ORDER BY created_at DESC';


    connection.query(query, function (err, results){
        if (err) {
            console.log (err);
        }

        for (var i=0; i< results.length; i++)
        {
            var twat = results[i];
            twat.time_from_now = moment(twat.created_at).fromNow();
        }

        res.render('tweets', {tweets:results});
    });
});

app.listen(8080, function() {
  console.log('Web server listening on port 8080!');
});

app.post('/tweets/create', function(req, res)
    {
        var query = 'INSERT INTO Twats(handle, body) VALUES(?,?)';
        var handle = req.body.handle;
        var body = req.body.body;

        connection.query(query, [handle, body], function (err){
            if (err)
            {
                console.log ("well shit\n" + err);
            }
            res.redirect('/');
        });

    });
