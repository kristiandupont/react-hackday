var _ = require("lodash");
var redis = require("redis");


function PersistenceSystem () {
  this.redisCx = redis.createClient();
}

PersistenceSystem.prototype.process = function (events) {
  _.each(events, function (event) {
    switch(event.target) {
      case 'db':
        switch(event.name) {
          case "message":
            this.redisCx.lpush("messages:" + event.message.roomId, JSON.stringify(event.message));
            break;
        }
        break;
    }
  }.bind(this));
}


function create () {
  return new PersistenceSystem();
}


module.exports = {
  create: create,
}



