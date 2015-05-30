const SocketIOStore = require('../stores/SocketIOStore.es6')
// Cursor data is handled outside of ShareJS
const _ioSocket = SocketIOStore.getSocket()
const SocketEventConstants = require('../../shared/constants/SocketEventConstants.es6')
const SnapmeetDispatcher = require('../dispatcher/SnapmeetDispatcher.es6')

_ioSocket.on(SocketEventConstants.SERVER_BROADCAST_PRESENCE, function(data){
  SnapmeetDispatcher.dispatch({
    type: SocketEventConstants.SERVER_BROADCAST_PRESENCE
    , resourceId: data.resourceId
    , presentUsers: data.presentUsers
  })
})  

module.exports = {
  presenceJoin(resourceId, resourceType) {
    _ioSocket.emit(SocketEventConstants.CLIENT_JOIN_PRESENCE, {
      resourceId: resourceId
      , resourceType: resourceType
    })
  }

  , presenceLeave(resourceId, resourceType) {
    _ioSocket.emit(SocketEventConstants.CLIENT_LEAVE_PRESENCE, {
      resourceId: resourceId
      , resourceType: resourceType
    })
  }
}
