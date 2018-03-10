require('dotenv').config();
var express = require('express');
var app = express();
var twilio = require('twilio');
var router = express.Router();
var http = require('http').Server(app);

var conversations= {};

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



var respond = function(toNumber, message){
  client.messages.create({
      body: message,
      to: toNumber,  // Text this number
      from: '+46769439389' // From a valid Twilio number
  })
  .then((message) => console.log(message.sid));

   res.sendFile(__dirname + '/message.html');
};



app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

//router.post('/message', twilio.webhook({validate: false}), function(req, res){
app.post('/message', function(req, res){


    //console.log(req.body);
    numberSender = req.body.From;
    dataSender = req.body.Body;
    console.log(req.body.From);
    console.log(req.body.Body);

    if(!(numberSender in conversations) && (dataSender.toLowerCase() == "help me")){
      //TODO Check for info in database as well
        conversations[numberSender] = {
          state: "firstContact",
          date: "",
          name: "",
          address: "",
          latitude: "",
          longitude: "",
          amount: "",
          comment: ""
        }
    } else {
      respond(numberSender, 'Please send "Help me"| "Help" ');
    }

    conv = conversations[numberSender];

    switch (conv.state) {
      case "firstContact":
        conv.state = "getName";
        respond(numberSender, "What is your name?");
        break;
      case "getName":
        conv.name = dataSender;
        conv.state = "getAddress";
        respond(numberSender, "What is your address?");
        break;
      case "getAddress":
        conv.address = dataSender;
        conv.state = "getAmount";
        respond(numberSender,"For how many people do you need water?");
        break;
      case "getAmount":
        conv.amount = dataSender;
        conv.state = "getComment";
        respond(numberSender,"Any special comment?");
        break;
      case "getComment":
        conv.comment = dataSender;
        conv.state = "confirmData";
        respond(numberSender,"Are your data correct? Y/N\n" + "Name :" + conv.name + "\nAddress :" + conv.address + "\nAmount : " + conv.amount + "\nComment : " + conv.comment);

        break;
      case "confirmData":
        if (dataSender.charAt(0).toLowerCase == "y"){
          //Finish //TODO update date
        }
        else {
          conv.state = "getName";
          respond(numberSender, "What is your name?");
        }

        break;
      default:

    }



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
