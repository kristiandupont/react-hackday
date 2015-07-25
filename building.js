var _ = require('lodash');
var room = require("./room");

function initialState () {
  return [room.initialState("kitchen"), room.initialState("livingroom")];
}

function consume (action, state) {
  switch(action.type) {
    default:
      return _.map(state, _.curry(room.consume)(action));
      break
  }
}

module.exports = {
  initialState: initialState,
  consume: consume
};
