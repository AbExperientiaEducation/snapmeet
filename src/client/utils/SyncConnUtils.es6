const ActionTypes = require('../constants/SocketConstants.es6').ActionTypes
const RichText = require('rich-text')
const ShareJS = require('share/lib/client/index.js')
const sockjs = require('sockjs-client')
const Immutable = require('immutable')
const MeetgunDispatcher = require('../dispatcher/MeetgunDispatcher.es6')

// We use a singleton connection for sync; sharejs can support
// an arbitrary number of docs over one connection.
let _syncConn = null
let _requestedDocuments = Immutable.Map()
const _socket = new sockjs("/democat")
const _socketObservers = {}

module.exports = {
  getSyncConn() {
    if(!_syncConn) {
      ShareJS.registerType(RichText.type)
      _syncConn = new ShareJS.Connection(_socket)
      const shareJSOnmessage = _socket.onmessage

      _socket.onmessage = function(message){
        const parsed = JSON.parse(message.data)
        if(parsed.type === 'cursor-data' && !!parsed.docId) {
          if(_socketObservers[parsed.docId]) {
            _socketObservers[parsed.docId](parsed.userId, parsed.displayString, parsed.cursorPos)  
          }
        } else {
          shareJSOnmessage.apply(this, arguments)  
        }
      }
      // _syncConn.debug = true // shareJS flag for console logging requests
    } 

    return _syncConn
  }

  , fetchDocument(docName) {
    if(_requestedDocuments.get(docName)) return
    _requestedDocuments = _requestedDocuments.set(docName, true)
    
    const doc = _syncConn.get('docs', docName)
    doc.subscribe()
    doc.whenReady(function(){
      // If doc.type is not set, it is a new document.
      if (!doc.type) {
        doc.create('rich-text', '')
      }

      setTimeout(function(){
        MeetgunDispatcher.dispatch({
          type: ActionTypes.RECEIVE_DOCUMENT
          , document: doc
        })
      }, 0)
    })
  }

  , broadcastCursor(docId, userId, displayString, cursorPos) {
    _socket.send(JSON.stringify({type: 'cursor-data', docId: docId, userId: userId, displayString: displayString, cursorPos: cursorPos}))
  }
  , addCursorChangeListener(docId, callback) {
    _socket.send(JSON.stringify({type: 'cursor-watch', docId: docId})) 
    _socketObservers[docId] = callback
  }

  , removeCursorChangeListener(docId) {
    delete _socketObservers[docId]
  }
}