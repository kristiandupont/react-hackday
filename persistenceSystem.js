var _ = require("lodash");
var redis = require("redis");
var Promise = require("bluebird");

function PersistenceSystem (redisCx) {
  this.redisCx = redisCx;
}

PersistenceSystem.prototype.processing = function (events) {
  var multi = this.redisCx.multi();
  _.each(events, function (event) {
    switch(event.target) {
      case 'db':
        switch(event.name) {
          case "message":
          console.log(multi);
            multi.lpush("messages:" + event.message.roomId, JSON.stringify(event.message));
            break;
        }
        break;
    }
  }.bind(this));

  return multi.executing();
}

function create (redisCx) {
  return new PersistenceSystem(redisCx);
}

module.exports = {
  create: create,
}



