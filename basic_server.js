var express = require('express');
var app = express();
var path = require('path');

app.get("/page", function(request, response) {
  var id = request.params.id;

  var obj = { id:id, Content:"content " + id};

  response.writeHead(200, {"Content-Type": "application/json"});
  response.write(JSON.stringify(obj));
});

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(8080);

// fs.readFile('index.html', function (err, html) {
//   if (err) {
//     throw err;
//   }
//   http.createServer(function(request, response) {
//     response.writeHeader(200, {"Content-Type": "text/html"});  // <-- HERE!
//     response.write(html);  // <-- HERE!
//     response.end();
//   }).listen(1337, '127.0.0.1');
// });
//
