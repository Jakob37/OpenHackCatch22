require('dotenv').config();
const {google} = require('googleapis');
const sheets = google.sheets('v4');
const googleAuth = require('./auth');

const SPREADSHEET_ID = '19BTlJfaRJTcBP-TJYmwtlIm7kmMW1iWyRegkrhgI3N4';

// googleAuth.authorize()
//     .then((auth) => {
//         sheetsApi.spreadsheets.values.get({
//             auth: auth,
//             spreadsheetId: SPREADSHEET_ID,
//             range: "requests!A2:I",
//         }, function (err, response) {
//             if (err) {
//                 console.log('The API returned an error: ' + err);
//                 return console.log(err);
//             }
//             var rows = response.data.values;
//             console.log(null, rows);
//             //console.log(null, response);
//         });
//     })
//     .catch((err) => {
//         console.log('auth error', err);
//     });

googleAuth.authorize()
    .then((auth) => {

        var request = {
            // The ID of the spreadsheet to update.
            spreadsheetId: '12VjDblmvSWincgitqPnHqLdIRKb6WNOLU2pU-_fZs24',  // TODO: Update placeholder value.
        
            // The A1 notation of a range to search for a logical table of data.
            // Values will be appended after the last row of the table.
            range: 'A2:I2',  // TODO: Update placeholder value.
        
            // How the input data should be interpreted.
            valueInputOption: 'USER_ENTERED',  // TODO: Update placeholder value.
        
            // How the input data should be inserted.
            insertDataOption: 'INSERT_ROWS',  // TODO: Update placeholder value.
        
            resource: {
              // TODO: Add desired properties to the request body.
              "values":[
                [
                  "nodejs",
                  "in",
                  "the",
                  "house"
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
        
            // TODO: Change code below to process the `response` object:
            console.log(response);        
        })
    })
    .catch((err) => {
        console.log('auth error', err);
    });