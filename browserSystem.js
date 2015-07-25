var _ = require('lodash');
var Promise = require("bluebird");

function BrowserSystem (redisCx) {
  this.sockets = {};
  this.redisCx = redisCx;
}

BrowserSystem.prototype.addBrowser = function (socket) {
  this.sockets[socket.id] = socket;
}

BrowserSystem.prototype.processing = function (events) {
  var promises = _.map(events, function (event) {
    return new Promise(function (resolve, reject) {
      switch(event.target) {
        case 'browser':
          if (event.name === "message-list") {
            this.redisCx.lrange("messages:" + event.roomId, 0, -1, function (err, data) {
              if (err) {
                reject();
              } else {
                var e = _.extend({}, event, { messages: _.map(data, JSON.parse) });
                console.log("Event: ", event);
                this.sockets[event.client].emit(event.name, e);
                resolve();
              }
            }.bind(this));
          } else {
            _.each(event.clients, function (client) {
              this.sockets[client].emit(event.name, event);
            }.bind(this));
            resolve();
          }
          break;
      };
    }.bind(this));
  }.bind(this));
}

function create (redisCx) {
  return new BrowserSystem(redisCx);
}

module.exports = {
  create: create,
}
