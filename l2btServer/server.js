'use strict';

var express = require('express');
var app = express();


var bodyParser = require('body-parser');
var parseUrlEnconded = bodyParser.urlencoded({extended: false});



app.use(express.static('static'));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function (request, response) {


});


app.listen(3002, function () {
  console.log('Listening on port 3002');
});

module.exports = app;