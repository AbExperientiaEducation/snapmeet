const SocketConstants = require('../../shared/constants/SocketEventConstants.es6');
const SnapmeetDispatcher = require('../dispatcher/SnapmeetDispatcher.es6')
const io = require('socket.io-client')()
const EventEmitter = require('events').EventEmitter
const CHANGE_EVENT = 'change'
const Immutable = require('Immutable')

let _presences = Immutable.Map()

const PresenceStore = Object.assign({}, EventEmitter.prototype, {
  emitChange() {
    this.emit(CHANGE_EVENT)
  }

  , getPresentUsers(resourceId) {
    return _presences.get(resourceId)
  }

  , addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback)
  }

  , removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback)
  }
})

PresenceStore.dispatchToken = SnapmeetDispatcher.register((action) => {
  switch(action.type) {
    case SocketConstants.SERVER_BROADCAST_PRESENCE:
      _presences = _presences.set(action.resourceId, action.presentUsers)
      PresenceStore.emitChange()
      break
    default:
      // no op
    }
})

module.exports = PresenceStore
