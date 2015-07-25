var express = require("express");
var path = require("path");
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var redis = require("redis");
//var room = require('./room');
var building = require("./building");

app.use('/', express.static(path.join(__dirname, 'static')));

var redisCx = redis.createClient();


var buildingState = building.initialState();
//var roomState = room.initialState();

io.on('connection', function(socket){
  console.log('a user connected');

  socket.on("command", function (command) {
    command.client = socket.id;
    buildingState = building.consume(command, buildingState);
    console.log(buildingState)
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
