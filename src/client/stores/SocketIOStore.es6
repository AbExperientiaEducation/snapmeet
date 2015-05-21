const SocketConstants = require('../constants/SocketConstants.es6');
const ResourceConstants = require('../../shared/constants/ResourceConstants.es6')
const SnapmeetDispatcher = require('../dispatcher/SnapmeetDispatcher.es6')
const io = require('socket.io-client')()
const EventEmitter = require('events').EventEmitter
const ServerResourceActionCreators = require('../actions/ServerResourceActionCreators.es6')
const CHANGE_EVENT = 'change'
const ActionTypes = SocketConstants.ActionTypes

// Setup the initial connection and dispatch when it's ready
// Pattern to have store initiate connection directly taken from Jin on
// https://groups.google.com/forum/#!msg/reactjs/jBPHH4Q-8Sc/93LMQIt4RmsJ
const _socket = io.connect("http://localhost")
_socket.on('connect', function(){
  SnapmeetDispatcher.dispatch({
    type: ActionTypes.SOCKETIO_CONNECT
  })
})

_socket.on('disconnect', function(){
  SnapmeetDispatcher.dispatch({
    type: ActionTypes.SOCKETIO_DISCONNECT
  })
})

_socket.on(ResourceConstants.REST_RESPONSE_EVENT, function(data){
  ServerResourceActionCreators.receiveResources(data)
})

const SocketStore = Object.assign({}, EventEmitter.prototype, {
  emitChange() {
    this.emit(CHANGE_EVENT)
  }

  , addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback)
  }

  , removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback)
  }

  , isConnected() {
    return _socket.connected
  }

  , getSocket() {return _socket}
})

SocketStore.dispatchToken = SnapmeetDispatcher.register((action) => {
  switch(action.type) {
    case ActionTypes.SOCKETIO_DISCONNECT:
    case ActionTypes.SOCKETIO_CONNECT:
      SocketStore.emitChange()
      break;

    default:
      // no op
    }
})

module.exports = SocketStore
