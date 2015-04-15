const MeetgunDispatcher = require('../dispatcher/MeetgunDispatcher.es6')
const SessionConstants = require('../constants/SessionConstants.es6')
const Immutable = require('immutable')
const EventEmitter = require('events').EventEmitter

const CHANGE_EVENT = 'change'
const ActionTypes = SessionConstants.ActionTypes
var _session = null
const _setSession = function(session) {
  _session = session
}

const SessionStore = Object.assign({}, EventEmitter.prototype, {
  emitChange() {
    this.emit(CHANGE_EVENT)
  }

  , addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback)
  }

  , removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback)
  }

  , currentUserSession() {
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
