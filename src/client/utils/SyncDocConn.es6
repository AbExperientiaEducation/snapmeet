const ActionTypes = require('../constants/SocketConstants.es6').ActionTypes
const RichText = require('rich-text')
const ShareJS = require('share/lib/client/index.js')
const Immutable = require('immutable')
const MeetgunDispatcher = require('../dispatcher/MeetgunDispatcher.es6')
const SocketIOStore = require('../stores/SocketIOStore.es6')
const SocketEventConstants = require('../../shared/constants/SocketEventConstants.es6')

let _requestedDocuments = Immutable.Map()

const _makeWebSockAdapter = function(ioSocket){
  // ShareJS Requires an object that conforms to websocket protocol.
  // It calls socket.send and socket.close. 
  // It also expects other methods to be called. See _registerListeners
  return {
    readyState: 1
    , send(msg) {
      ioSocket.emit(SocketEventConstants.SHARE_JS_DATA, msg)
    }
    , close() {
      raise("ShareJS attempted to close socket")
    }
  }
}

const _registerListeners = function(ioSocket, webSockAdapter){
  // ShareJS expects these events to be called on the webSocket object
  // onmessage should be called when there is data for ShareJS
  // onopen, onclose, and onerror map to connect, disconnect, and error events
  ioSocket.on('connect', function(){webSockAdapter.onopen()})
  ioSocket.on('disconnect', function(){webSockAdapter.onclose()})
  ioSocket.on('error', function(error){webSockAdapter.onerror(error)})
  ioSocket.on(SocketEventConstants.SHARE_JS_DATA, function(data){ webSockAdapter.onmessage(data)})}

let _syncConn = null
const _getSyncConn = function(){
  if(!_syncConn) {
    ShareJS.registerType(RichText.type)
    const ioSocket = SocketIOStore.getSocket()
    const webSockAdapter = _makeWebSockAdapter(ioSocket)
    _registerListeners(ioSocket, webSockAdapter)
    _syncConn = new ShareJS.Connection(webSockAdapter)
    ioSocket.emit(SocketEventConstants.SHARE_JS_READY)
  }
  return _syncConn
}

module.exports = {
  fetchDocument(docName) {
    if(_requestedDocuments.get(docName)) return
    _requestedDocuments = _requestedDocuments.set(docName, true)
    const syncConn = _getSyncConn()
    const doc = syncConn.get('docs', docName)
    doc.subscribe()
    doc.whenReady(function(){
      // If doc.type is not set, it is a new document.
      if (!doc.type) {
        doc.create(RichText.type.name, '')
      }

      setTimeout(function(){
        MeetgunDispatcher.dispatch({
          type: ActionTypes.RECEIVE_DOCUMENT
          , document: doc
        })
      }, 0)
    })
  }
}
