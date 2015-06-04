const ActionTypes = require('../constants/SocketConstants.es6').ActionTypes
const RichText = require('rich-text')
const ShareJS = require('share/lib/client/index.js')
const TextOTType = require('ot-text')
const Immutable = require('immutable')
const SnapmeetDispatcher = require('../dispatcher/SnapmeetDispatcher.es6')
const SocketIOStore = require('../stores/SocketIOStore.es6')
const SocketEventConstants = require('../../shared/constants/SocketEventConstants.es6')

let _requestedDocuments = Immutable.Map()
const _webSockAdapter = {
    readyState: 1
    , close() {      
    }
  }

const _makeWebSockAdapter = function(ioSocket){
  // ShareJS Requires an object that conforms to websocket protocol.
  // It calls socket.send and socket.close. 
  // It also expects other methods to be called. See _registerListeners
  _webSockAdapter.readyState = 1
  _webSockAdapter.send = (msg) => {
    ioSocket.emit(SocketEventConstants.SHARE_JS_DATA, msg)
  }
  return _webSockAdapter
}

let _syncConn = null

const _registerListeners = function(ioSocket, webSockAdapter){
  // ShareJS expects these events to be called on the webSocket object
  // onmessage should be called when there is data for ShareJS
  // onopen, onclose, and onerror map to connect, disconnect, and error events
  ioSocket.on('connect', function(){webSockAdapter.onopen()})
  ioSocket.on('disconnect', function(){
    _syncConn = null
    _requestedDocuments = Immutable.Map()
    webSockAdapter.onclose()
  })
  ioSocket.on('error', function(error){webSockAdapter.onerror(error)})
  ioSocket.on(SocketEventConstants.SHARE_JS_DATA, function(data){ webSockAdapter.onmessage(data)})
}

const _getSyncConn = function(){
  if(!_syncConn) {
    ShareJS.registerType(RichText.type)
    ShareJS.registerType(TextOTType.type)
    const ioSocket = SocketIOStore.getSocket()
    const webSockAdapter = _makeWebSockAdapter(ioSocket)
    _registerListeners(ioSocket, webSockAdapter)
    _syncConn = new ShareJS.Connection(webSockAdapter)
    ioSocket.emit(SocketEventConstants.SHARE_JS_READY)
  }
  return _syncConn
}

module.exports = {
  fetchDocument(docName, plainText = false) {
    if(_requestedDocuments.get(docName)) return
    _requestedDocuments = _requestedDocuments.set(docName, true)
    const syncConn = _getSyncConn()
    const doc = syncConn.get('docs', docName)
    doc.subscribe()
    doc.whenReady(function(){
      // If doc.type is not set, it is a new document.
      if (!doc.type) {
        const type = plainText ? 'text' : RichText.type.name
        doc.create(type, '')
      }

      setTimeout(function(){
        SnapmeetDispatcher.dispatch({
          type: ActionTypes.RECEIVE_DOCUMENT
          , document: doc
        })
      }, 0)
    })
  }
}
