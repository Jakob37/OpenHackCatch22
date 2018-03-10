require('dotenv').config();
var express = require('express');
var app = express();

var accountSid = process.env.twilioAccountSid;
var authToken = process.env.twilioAuthToken;  

var twilio = require('twilio');
var client = new twilio(accountSid, authToken);

client.messages.create({
    body: 'Hello from Node',
    to: '+46703209169',  // Text this number
    from: '+46769439389' // From a valid Twilio number
})
.then((message) => console.log(message.sid));


app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

app.get('/message', function(req, res){
    res.sendFile(__dirname + '/message.html');
});