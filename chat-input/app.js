require('dotenv').config();

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
