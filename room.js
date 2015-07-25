var _ = require('lodash');

function initialState (roomId) {
  return { id: roomId, messages: [] };
}

function consume (action, state) {
  switch(action.type) {
    case 'add-message':
      if (action.roomId === state.id) {
        return _.extend({}, state, { 
          messages: state.messages.concat(_.pick(action, ['client', 'message']))
        });
      } else {
        return state;
      }
      break;

    default:
      return state;
      break
  }
}

module.exports = {
  initialState: initialState,
  consume: consume
};
