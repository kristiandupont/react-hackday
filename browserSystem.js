var _ = require('lodash');
var Promise = require("bluebird");

function BrowserSystem (redisCx) {
  this.sockets = {};
  this.redisCx = redisCx;
}

BrowserSystem.prototype.addBrowser = function (socket) {
  this.sockets[socket.id] = socket;
}

function gettingBrowserEvent(redisCx, event) {
  if (event.name === "message-list") {
    return redisCx.lranging("messages:" + event.roomId, 0, -1).then(function (data) {
      return _.extend({}, event, { messages: _.map(data, JSON.parse) });
    });
  } else {
    return Promise.resolve(event);
  }
}

BrowserSystem.prototype.processing = function (events) {
  var promises = _.map(events, function (event) {
    switch(event.target) {
      case 'browser':
        gettingBrowserEvent(this.redisCx, event).then(function (e) {
          _.each(event.clients, function (client) {
            this.sockets[client].emit(e.name, e);
          }.bind(this));
        }.bind(this));
        break;
    };
  }.bind(this));

  return Promise.all(promises);
}

function create (redisCx) {
  return new BrowserSystem(redisCx);
}

module.exports = {
  create: create,
}
