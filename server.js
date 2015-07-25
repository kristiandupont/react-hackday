var express = require("express");
var path = require("path");
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var room = require('./room');

app.use('/', express.static(path.join(__dirname, 'static')));

var roomState = room.initialState();

io.on('connection', function(socket){
  console.log('a user connected');

  socket.on("command", function (command) {
    command.client = socket.id;
    roomState = room.consume(command, roomState);
    console.log(roomState)
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
