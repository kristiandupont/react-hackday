var _ = require('lodash');
var room = require("./room");

function initialState () {
  return {
    rooms: [room.initialState("kitchen"), room.initialState("livingroom")]
  };
}

function consume (action, events, state) {
  switch(action.type) {
    default:
      return _.extend({}, state, {
        rooms: _.map(state.rooms, _.curry(room.consume)(action, events))
      });
      break;
  }
}

module.exports = {
  initialState: initialState,
  consume: consume
};
