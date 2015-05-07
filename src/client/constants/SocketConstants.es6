const keyMirror = require('keymirror');

module.exports = {
  ActionTypes: keyMirror({
    RECEIVE_DOCUMENT: null
    , SOCKETIO_CONNECT: null
    , SOCKETIO_DISCONNECT: null
  })
  , ConnectedStates: keyMirror({
    CONNECTED: null
    , RECONNECTING: null
    , DISCONNECTED: null
  })
}
