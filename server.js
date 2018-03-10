var express = require('express');
var app = express();
var path = require('path');
const request = require('request');

var http = require('http');

var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');


var SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
  process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'sheets.googleapis.com-nodejs-quickstart.json';

var last_generated_data = {empty:"No data generated yet"};

function retrieve_data() {

  // Load client secrets from a local file.
  fs.readFile('server/client_secret.json', function processClientSecrets(err, content) {
    if (err) {
      console.log('Error loading client secret file: ' + err);
      return;
    }
    // Authorize a client with the loaded credentials, then call the
    // Google Sheets API.
    authorize(JSON.parse(content), listMajors);
  });

  return JSON.stringify(last_generated_data);
}
function authorize(credentials, callback) {
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function(err, token) {
    if (err) {
      getNewToken(oauth2Client, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(oauth2Client);
    }
  });
}

function getNewToken(oauth2Client, callback) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function(code) {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client);
    });
  });
}

function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log('Token stored to ' + TOKEN_PATH);
}


function listMajors(auth) {
  var sheets = google.sheets('v4');
  sheets.spreadsheets.values.get({
    auth: auth,
    spreadsheetId: '19BTlJfaRJTcBP-TJYmwtlIm7kmMW1iWyRegkrhgI3N4',
    range: 'requests!A2:I',
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    var rows = response.values;

    last_generated_data = rows;

    if (rows.length == 0) {
      console.log('No data found.');
    } else {
      console.log('id\tdate\t\tname\t\tphone\t\taddress\t\tlatitude\tlongitude\tamount\tcomment');
      for (var i = 0; i < rows.length; i++) {
        var row = rows[i]; // Print columns A and E, which correspond to indices 0 and 4.
        //document.write('%d\t%s\t%s\t%d\t%s\t%s\t%s\t%d\t%s', row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7], row[8]);
        console.log('%d\t%s\t%s\t%d\t%s\t%s\t%s\t%d\t%s', row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7], row[8]);
      }
    }
  });
}

// Server stuff starts here //

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

const dummy_object = [{id:1, lat:10, lng:20}, {id:2, lat:10, lng:20}, {id:3, lat:10, lng:20}];

app.get("/api", function(req, res)  {

  var results_json = retrieve_data();
  res.json(results_json);
});


app.listen(8080);



