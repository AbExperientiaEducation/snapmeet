const SnapmeetDispatcher = require('../dispatcher/SnapmeetDispatcher.es6')
const PubSubStore = require('./PubSubStore.es6')
const SocketConstants = require('../constants/SocketConstants.es6');
const ActionTypes = SocketConstants.ActionTypes
const ConnectedStates = SocketConstants.ConnectedStates
const SnapmeetRouter = require('../components/SnapmeetRouter.react.es6')
const _globalUIState = {connectStatus: ConnectedStates.CONNECTING}
const ResourceConstants = require('../../shared/constants/ResourceConstants.es6')
const UIConstants = require('../constants/UIConstants.es6')

let _pendingMeeting = null

const GlobalUIStore = Object.assign({}, PubSubStore, {
  globalUIState() {
    return _globalUIState
  }
})

GlobalUIStore.dispatchToken = SnapmeetDispatcher.register((action) => {
  const MEETING_LABEL = ResourceConstants.Meeting.LABEL
  switch(action.type) {

    case ActionTypes.SOCKETIO_DISCONNECT:
      _globalUIState.connectStatus = ConnectedStates.RECONNECTING
      GlobalUIStore.emitChange()
      break

    case ActionTypes.SOCKETIO_CONNECT:
      _globalUIState.connectStatus = ConnectedStates.CONNECTED
      GlobalUIStore.emitChange()
      break
    
    case ResourceConstants.Meeting.ActionTypes.LOCAL_RESOURCE_CREATED:
      // TODO: This is a terrible hack. I'm having trouble thinking
      // of clean architecture to accomplish this.
      _pendingMeeting = action.id
      break
    case ResourceConstants.RECEIVE_RAW_EVENT:
      if(!_pendingMeeting || !action.groupedRawResources[MEETING_LABEL]) return
        let match = null
        !action.groupedRawResources[MEETING_LABEL].forEach(m => {
          if(m.id === _pendingMeeting) {
            match = true
          }
        })
        if(match) {
          const router = SnapmeetRouter.getRouter()
          router.transitionTo('meeting', {id: _pendingMeeting})
          _pendingMeeting = null
        }
      break

    case UIConstants.VC_OPENED:
      _globalUIState.vcOpen = true
      GlobalUIStore.emitChange()
      break
      
    case UIConstants.VC_CLOSED:
      _globalUIState.vcOpen = false
      GlobalUIStore.emitChange()
      break

    default:
      // no op
    }
})


module.exports = GlobalUIStore