const ActionTypes = require('../constants/SocketConstants.es6').ActionTypes
const MeetgunDispatcher = require('../dispatcher/MeetgunDispatcher.es6')
const SyncDocConn = require('../utils/SyncDocConn.es6')
const Immutable = require('immutable')
const EventEmitter = require('events').EventEmitter

const CHANGE_EVENT = 'change'
let _documents = Immutable.Map()

const _addDocument = (doc) => {
  _documents = _documents.set(doc.name, doc)
}

const SyncdocStore = Object.assign({}, EventEmitter.prototype, {
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
    return _socket.readyState === 1
  }

  , getDocument(docName, isPlainText) {
    const doc = _documents.get(docName)
    if(!doc) {
      SyncDocConn.fetchDocument(docName, isPlainText)
    }
    return doc
  }
})

SyncdocStore.dispatchToken = MeetgunDispatcher.register((action) => {
  switch(action.type) {
    case ActionTypes.RECEIVE_DOCUMENT:
      _addDocument(action.document)
      SyncdocStore.emitChange()
      break

    default:
      // no op
    }
})

module.exports = SyncdocStore
