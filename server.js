var express = require("express");
var path = require("path");
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var building = require("./building");
var BrowserSystem = require('./browserSystem');
var PersistenceSystem = require("./persistenceSystem");
var redis = require("redis");
var _ = require('lodash');
var Promise = require("bluebird");
var promisifyRedis = require('./promisifyRedis');

app.use('/', express.static(path.join(__dirname, 'static')));

var redisCx = promisifyRedis(redis.createClient());

var browserSystem = BrowserSystem.create(redisCx);
var persistenceSystem = PersistenceSystem.create(redisCx);

var systems = [ browserSystem, persistenceSystem ]

var buildingState = building.initialState();

io.on('connection', function(socket){
  browserSystem.addBrowser(socket);
  console.log('a user connected');

  socket.on("command", function (command) {
    command.client = socket.id;
    var events = [];
    buildingState = building.consume(command, events, buildingState);
    console.log(events);

    var promises = _.map(systems, function (system) { 
      return system.processing(events); 
    });
    Promise.all(promises).then(function () { console.log("Done"); });

    // console.dir(JSON.stringify(buildingState))
  });

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
