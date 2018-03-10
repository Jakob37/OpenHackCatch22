var express = require('express');
var app = express();
var path = require('path');
const request = require('request');

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});


app.get("/page", function(request, response) {
  var id = request.params.id;

  var obj = { id:id, Content:"content " + id};
  response.setHeader('Content-Type', 'application/json');
  // response.writeHead(200, {"Content-Type": "application/json"});
  response.write(JSON.stringify({a:1}));
});


const options = {
  url: 'https://jsonplaceholder.typicode.com/posts',
  method: 'GET',
  headers: {
    'Accept': 'application/json',
    'Accept-Charset': 'utf-8',
    'User-Agent': 'my-reddit-client'
  }
};

const dummy_object = [{id:1, lat:10, lng:20}, {id:2, lat:10, lng:20}, {id:3, lat:10, lng:20}];

app.get("/api", function(req, res)  {
  // request(options, function(err, output, body) {
  //   var json = JSON.parse(body);
  //   console.log(json); // Logging the output within the request function
  //   res.json(json); //then returning the response.. The request.json is empty over here
  // })
  res.json(dummy_object);
}); //closing the request function


app.listen(8080);




// var express = require('express');
// //var server = express.createServer();
// // express.createServer()  is deprecated.
// var server = express(); // better instead
// server.configure(function(){
//   server.use('/media', express.static(__dirname + '/media'));
//   server.use(express.static(__dirname + '/public'));
// });
// server.listen(3000);



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
