const MeetgunDispatcher = require('../dispatcher/MeetgunDispatcher.es6')
const SessionConstants = require('../constants/SessionConstants.es6')
const SessionWebAPIUtils = require('../utils/SessionWebAPIUtils.es6')
const Immutable = require('immutable')
const EventEmitter = require('events').EventEmitter

const CHANGE_EVENT = 'change'
const ActionTypes = SessionConstants.ActionTypes

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

  , get() {
    return _session.id
  }
})

SessionStore.dispatchToken = MeetgunDispatcher.register((action) => {
  switch(action.type) {
    case ActionTypes.SIGN_IN:
      // Do a sign in via a utility
      SessionWebAPIUtils.signIn(action.data)
      // In the utility, call the SIGN_IN_SUCCEEDED or FAILED action type
      SessionStore.emitChange()
      break;

    case ActionTypes.SIGN_IN_SUCCEEDED:
      // Do stuff
      SessionStore.emitChange()
      break;

    case ActionTypes.SIGN_IN_FAILED:
      // Do stuff
      SessionStore.emitChange()
      break;

    case ActionTypes.SIGN_UP:
      // Do a sign in via a utility
      SessionWebAPIUtils.signUp(action.data)
      SessionStore.emitChange()
      break;

    case ActionTypes.SIGN_UP_SUCCEEDED:
      // Do stuff
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
