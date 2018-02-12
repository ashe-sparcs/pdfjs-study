var express = require('express');
var app = express();

app.use('/static', express.static('static'));
app.use('/bower_components', express.static('bower_components'));

app.get('/',function(req,res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/viewer',function(req,res){
  res.sendFile(__dirname + '/viewer.html');
});

app.get('/pageviewer',function(req,res){
  res.sendFile(__dirname + '/pageviewer.html');
});

app.get('/simpleviewer',function(req,res){
  res.sendFile(__dirname + '/simpleviewer.html');
});

app.get('/singlepageviewer',function(req,res){
  res.sendFile(__dirname + '/singlepageviewer.html');
});

app.get('/acroforms',function(req,res){
  res.sendFile(__dirname + '/acroforms.html');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
