var express = require('express');
var app = express();
var path = require('path');
const request = require('request');

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

const dummy_object = [{id:1, lat:10, lng:20}, {id:2, lat:10, lng:20}, {id:3, lat:10, lng:20}];

app.get("/api", function(req, res)  {
  res.json(dummy_object);
});


app.listen(8080);
