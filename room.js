var _ = require('lodash');

function initialState (roomId) {
  return {
    id: roomId,
    messages: [],
    clients: []
  };
}

function consume (action, events, state) {
  switch(action.type) {
    case 'add-message':
      if (action.roomId === state.id) {

        events.push({
          target: 'browser',
          clients: _.difference(state.clients, [action.client]),
          name: 'message',
          message: action.message
        });

        return _.extend({}, state, {
          messages: state.messages.concat(_.pick(action, ['client', 'message']))
        });

      } else {
        return state;
      }
      break;

    case 'join-room':

      return _.extend({}, state, {
        clients: state.clients.concat(action.client)
      });
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
