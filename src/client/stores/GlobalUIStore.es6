const MeetgunDispatcher = require('../dispatcher/MeetgunDispatcher.es6')
const PubSubStore = require('./PubSubStore.es6')
const SocketConstants = require('../constants/SocketConstants.es6');
const ActionTypes = SocketConstants.ActionTypes
const ConnectedStates = SocketConstants.ConnectedStates

const _globalUIState = {connectStatus: ConnectedStates.CONNECTING}

const GlobalUIStore = Object.assign({}, PubSubStore, {
  globalUIState() {
    return _globalUIState
  }
})

GlobalUIStore.dispatchToken = MeetgunDispatcher.register((action) => {
  switch(action.type) {

    case ActionTypes.SOCKETIO_DISCONNECT:
      _globalUIState.connectStatus = ConnectedStates.RECONNECTING
      GlobalUIStore.emitChange()
      break

    case ActionTypes.SOCKETIO_CONNECT:
      _globalUIState.connectStatus = ConnectedStates.CONNECTED
      GlobalUIStore.emitChange()
      break
    
    default:
      // no op
    }
})


module.exports = GlobalUIStore