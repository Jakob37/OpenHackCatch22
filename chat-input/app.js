require('dotenv').config();
var express = require('express');
var app = express();
var twilio = require('twilio');
var router = express.Router();
var http = require('http').Server(app);
var {google} = require('googleapis');
var sheets = google.sheets('v4');
var googleAuth = require('./auth');
var moment = require('moment');

var conversations= {};

var bodyParser = require('body-parser')

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

//This could potentally be unsecure and very dangerously...
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Credentials", true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
  next();
});

var accountSid = process.env.twilioAccountSid;
var authToken = process.env.twilioAuthToken;

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;


var client = new twilio(accountSid, authToken);

// client.messages.create({
//     body: 'Hello from Node',
//     to: '+46703209169',  // Text this number
//     from: '+46769439389' // From a valid Twilio number
// })
//.then((message) => console.log(message.sid));



var respond = function(toNumber, message, res){
  client.messages.create({
      body: message,
      to: toNumber,  // Text this number
      from: '+46769439389' // From a valid Twilio number
  })
  .then((message) => console.log(message.sid));

   res.sendFile(__dirname + '/message.html');
};

var writeToSheets = function(number, conv){
  googleAuth.authorize()
  .then((auth) => {

      var request = {
          // The ID of the spreadsheet to update.
          spreadsheetId: SPREADSHEET_ID,
      
          // The A1 notation of a range to search for a logical table of data.
          // Values will be appended after the last row of the table.
          range: 'A2:I2',
      
          // How the input data should be interpreted.
          valueInputOption: 'USER_ENTERED', 

          // How the input data should be inserted.
          insertDataOption: 'INSERT_ROWS', 
      
          resource: {
            "values":[
              [
                "",
                conv.date, 
                conv.name,
                number,
                conv.address,
                "", // latitude
                "", // longitude
                conv.amount,
                conv.comment
              ]
            ]
          },
      
          auth: auth,
        };
      
        sheets.spreadsheets.values.append(request, function(err, response) {
          if (err) {
            console.error(err);
            return;
          }

          console.log(response);        
      })
  })
  .catch((err) => {
      console.log('auth error', err);
  });
};


app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

app.post('/message', function(req, res){

    numberSender = req.body.From;
    dataSender = req.body.Body;
    console.log(req.body.From);
    console.log(req.body.Body);
    console.log(conversations);

    if(!(numberSender in conversations)){
      if(dataSender.toLowerCase().startsWith("help")){
        //TODO Check for info in database as well
          conversations[numberSender] = {
            state: "firstContact",
            date: moment().format('YYYYMMDDHHmm'),
            name: "",
            address: "",
            latitude: "",
            longitude: "",
            amount: "",
            comment: ""
         }
      } else {
        respond(numberSender, 'Please send "Help me"| "Help" ', res);
        return;
      }
    }


    conv = conversations[numberSender];

    switch (conv.state) {
      case "firstContact":
        conv.state = "getName";
        respond(numberSender, "What is your name?", res);
        break;
      case "getName":
        conv.name = dataSender;
        conv.state = "getAddress";
        respond(numberSender, "What is your address?", res);
        break;
      case "getAddress":
        conv.address = dataSender;
        conv.state = "getAmount";
        respond(numberSender,"For how many people do you need water every day?", res);
        break;
      case "getAmount":
        conv.amount = dataSender;
        conv.state = "getComment";
        respond(numberSender,"Any special comment?", res);
        break;
      case "getComment":
        conv.comment = dataSender;
        conv.state = "confirmData";
        respond(numberSender,"Are your data correct? Y/N\n" + "Name: " + conv.name + "\nAddress: " + conv.address + "\nAmount: " + conv.amount + "\nComment: " + conv.comment, res);

        break;
      case "confirmData":
        if (dataSender.toLowerCase().charAt(0) === "y"){
          writeToSheets(numberSender, conv)

          conv.state = "toDelete";
          respond(numberSender,"Your request has been handled", res);
          console.log("Success ! \n");
        }
        else {
          conv.state = "getName";
          respond(numberSender, "What is your name?", res);
        }

        break;
      default:

    }

    if (conv.state === "toDelete"){
      delete conversations[numberSender];
    } else{
        conversations[numberSender] = conv;
    }



});


app.post('/confirmation', function(req, res){
  console.log("Confirmation is being sent to:");
  console.log(req.body);

  number = req.body.number;
  if(number !== null){
    respond(number, "Help is on its way.", res);
  }
  res.send('<h1>success</h1>');
  //res.sendFile(__dirname + '/index.html');
});


app.post('/addRequest', function(req, res){
  console.log("addRequest:");
  console.log(req.body);

  var request = {
    date: moment().format('YYYYMMDDHHmm'),
    name: req.body,
    address: req.body.address,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    amount: req.body.amount,
    comment: req.body.comment
 }

 console.log(request);

//Todo: add in database.
  res.send('<h1>success</h1>');
});

http.listen(process.env.PORT || 3000, function(){
    console.log('listening on *:3000');
});
