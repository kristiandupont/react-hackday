var express = require("express");
var path = require("path");
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var building = require("./building");
var BrowserSystem = require('./browserSystem');
var PersistenceSystem = require("./persistenceSystem");
var _ = require('lodash');

app.use('/', express.static(path.join(__dirname, 'static')));

var browserSystem = BrowserSystem.create();
var persistenceSystem = PersistenceSystem.create();

var systems = [ browserSystem, persistenceSystem ]

var buildingState = building.initialState();
//var roomState = room.initialState();

io.on('connection', function(socket){
  browserSystem.addBrowser(socket);
  // clients[socket.id] = socket;
  console.log('a user connected');

  socket.on("command", function (command) {
    command.client = socket.id;
    var events = [];
    buildingState = building.consume(command, events, buildingState);

    _.each(systems, function (system) { system.process(events); })

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
