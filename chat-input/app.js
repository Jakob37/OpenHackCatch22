require('dotenv').config();
var express = require('express');
var app = express();
var http = require('http').Server(app);

var accountSid = process.env.twilioAccountSid;
var authToken = process.env.twilioAuthToken;  

var twilio = require('twilio');
var client = new twilio(accountSid, authToken);

// client.messages.create({
//     body: 'Hello from Node',
//     to: '+46703209169',  // Text this number
//     from: '+46769439389' // From a valid Twilio number
// })
//.then((message) => console.log(message.sid));


app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

app.get('/message', function(req, res){
    client.messages.create({
        body: 'Hello from Node',
        to: '+46703209169',  // Text this number
        from: '+46769439389' // From a valid Twilio number
    })
    .then((message) => console.log(message.sid));

    res.sendFile(__dirname + '/message.html');
});

http.listen(process.env.PORT || 3000, function(){
    console.log('listening on *:3000');
});