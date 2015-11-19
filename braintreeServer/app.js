'use strict';

var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var parseUrlEnconded = bodyParser.urlencoded({extended: false});

var server = app.listen(3000, function () {
  console.log('Listening on port 3000');
});

var Pusher = require('pusher');

var pusher = new Pusher({
  appId: APP,
  key: KEY,
  secret: SECRET,
  encrypted: true
});
pusher.port = 443;

pusher.trigger('test_channel', 'my_event', {
  "message": "hello world"
});

app.use(express.static('public'));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

/* Nothing to see up here, just us dependencies */

/* THE DEMO BEGINS */

/* First, require Braintree */

var braintree = require('braintree');

/* Then initialise with your API credentials */

var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: MERCHANTID,
  publicKey: PUBLIC,
  privateKey: PRIVATE
})

app.get('/', function (request, response) {


  /* Generate client token and render index */
  gateway.clientToken.generate({}, function(err, res){
      response.render('index', {
        clientToken: res.clientToken
      });
  });

    
});


app.post('/process', parseUrlEnconded, function (request, response) {

/* Get the request body */

var parameters = request.body;


/* Perform a sale, don't forget your method nonce! */

gateway.transaction.sale({
  amount: parameters.amount,
  paymentMethodNonce: parameters.payment_method_nonce
}, function (err, result){
  if (err) throw err;

    if (result.success) {
      //Do some Pushery bits 
      var data = {"pAmount":parameters.amount, "pName":parameters.pname}
      pusher.trigger('test_channel', 'my_event', JSON.stringify(data));
      response.sendFile('success.html', {root: './public'});
    } else {
      
      response.sendFile('error.html', {root: './public'});
    }
 })

 
});



module.exports = app;
