require('dotenv').config();
var express = require('express');
var app = express();
var twilio = require('twilio');
var router = express.Router();
var http = require('http').Server(app);


var bodyParser = require('body-parser')

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

var accountSid = process.env.twilioAccountSid;
var authToken = process.env.twilioAuthToken;  


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

//router.post('/message', twilio.webhook({validate: false}), function(req, res){
app.post('/message', function(req, res){


    //console.log(req.body);
    console.log(req.body.From);
    console.log(req.body.Body);
    
    
    client.messages.create({
        body: 'Your message was received.',
        to: '+46703209169',  // Text this number
        from: '+46769439389' // From a valid Twilio number
    })
    .then((message) => console.log(message.sid));

    res.sendFile(__dirname + '/message.html');
});

http.listen(process.env.PORT || 3000, function(){
    console.log('listening on *:3000');
});