var _ = require('lodash');

function BrowserSystem () {
  this.sockets = {};
}

BrowserSystem.prototype.addBrowser = function (socket) {
  this.sockets[socket.id] = socket;
}

BrowserSystem.prototype.process = function (events) {
  _.each(events, function (event) {
    switch(event.target) {
      case 'browser':
        _.each(event.clients, function (client) {
          this.sockets[client].emit(event.name, event);
        }.bind(this));
        break;
    }
  }.bind(this));
}


function create () {
  return new BrowserSystem();
}


module.exports = {
  create: create,
}