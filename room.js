var _ = require('lodash');

function initialState (roomId) {
  return {
    id: roomId,
    clients: []
  };
}

function consume (action, events, state) {
  switch(action.type) {
    case 'add-message':
      if (action.roomId === state.id) {
        var message = _.pick(action, ['roomId', 'client', 'message'])

        events.push({
          target: 'browser',
          clients: _.difference(state.clients, [action.client]),
          name: 'message',
          message: message
        });

        events.push({
          target: "db",
          name: "message",
          message: message
        });

      }

      return state;
      break;

    case 'join-room':
      if (action.roomId === state.id) {

        events.push({
          target: "browser",
          clients: [action.client],
          name: "message-list",
          roomId: action.roomId
        });

        return _.extend({}, state, {
          clients: state.clients.concat(action.client)
        });
        break;
      }

    default:
      return state;
      break
  }
}

module.exports = {
  initialState: initialState,
  consume: consume
};
