const SocketIOStore = require('../stores/SocketIOStore.es6')
// Cursor data is handled outside of ShareJS
const _cursorObservers = {}
const _ioSocket = SocketIOStore.getSocket()
const SocketEventConstants = require('../../shared/constants/SocketEventConstants.es6')

_ioSocket.on('cursorData', function(data){
  if(data.docId && _cursorObservers[data.docId]) {
    _cursorObservers[data.docId](data.userId, data.displayString, data.cursorPos)
  }
})  

module.exports = {
  broadcastCursor(docId, userId, displayString, cursorPos) {
    _ioSocket.emit(SocketEventConstants.CURSOR_DATA, {docId: docId, userId: userId, displayString: displayString, cursorPos: cursorPos})
  }
  , addCursorChangeListener(docId, callback) {
    _ioSocket.emit(SocketEventConstants.CURSOR_SUBSCRIBE, docId) 
    _cursorObservers[docId] = callback
  }

  , removeCursorChangeListener(docId) {
    _ioSocket.emit(SocketEventConstants.CURSOR_UNSUBSCRIBE, docId) 
    delete _cursorObservers[docId]
  }
}
