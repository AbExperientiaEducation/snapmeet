const MeetgunDispatcher = require('../dispatcher/MeetgunDispatcher.es6')
const SessionConstants = require('../constants/SessionConstants.es6')
const Immutable = require('immutable')
const PubSubStore = require('../utils/PubSubStore.es6')

const ActionTypes = SessionConstants.ActionTypes
let _session = null
const _setSession = function(session) {
  _session = session
}

const SessionStore = Object.assign({}, PubSubStore, {
  currentUserSession() {
    return _session
  }
})

SessionStore.dispatchToken = MeetgunDispatcher.register((action) => {
  switch(action.type) {
    
    case ActionTypes.SIGN_IN_SUCCEEDED:
      _setSession(action.session)
      SessionStore.emitChange()
      break;

    case ActionTypes.SIGN_IN_FAILED:
      // Do stuff
      SessionStore.emitChange()
      break;

    case ActionTypes.SIGN_UP_SUCCEEDED:
      _setSession(action.session)
      SessionStore.emitChange()
      break;

    case ActionTypes.SIGN_UP_FAILED:
      // Do stuff
      SessionStore.emitChange()
      break;

    default:
      // no op
    }
})

module.exports = SessionStore
