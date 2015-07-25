var _ = require('lodash');

function initialState () {
  return [];
}

function consume (action, state) {
  switch(action.type) {
    case 'add-message':
      return state.concat(_.pick(action, ['client', 'message']));
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