var _ = require('lodash');

function promisifyRedis(cx) {
  return {

    lranging: function (key, start, stop) {
      return new Promise(function (resolve, reject) {
        cx.lrange(key, start, stop, function (err, data) {
          if (!err) {
            resolve(data);
          } else {
            reject(err);
          }
        });
      });
    },

    multi: function () {
      var m = cx.multi();
      m.executing = function () {
        return new Promise(function (resolve, reject) {
          m.exec(function (err, data) {
            if(!err) {
              resolve(data);
            } else {
              reject(err);
            }
          })
        });
      };
      return m;
    }
  };
}

module.exports = promisifyRedis;