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
  return new Promise(function (resolve, reject) {
    if (event.name === "message-list") {
      redisCx.lrange("messages:" + event.roomId, 0, -1, function (err, data) {
        if (err) {
          reject();
        } else {
          var e = _.extend({}, event, { messages: _.map(data, JSON.parse) });
          resolve(e);
        }
      });
    } else {
      return Promise.resolve(event);
    }
  });
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
