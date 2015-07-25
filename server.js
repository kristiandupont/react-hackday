var express = require("express");
var path = require("path");
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
// var redis = require("redis");
var building = require("./building");

app.use('/', express.static(path.join(__dirname, 'static')));
// var redisCx = redis.createClient();



var buildingState = building.initialState();
//var roomState = room.initialState();

io.on('connection', function(socket){
  console.log('a user connected');

  socket.on("command", function (command) {
    command.client = socket.id;
    var events = [];
    buildingState = building.consume(command, events, buildingState);
    // ToDo: process events
    console.log(events);
    // console.dir(JSON.stringify(buildingState))
  });

  //socket.on("pubsub", function (command) {
  //  command.client = socket;
  //
  //});
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
