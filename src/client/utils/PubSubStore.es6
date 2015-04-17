const ResourceConstants = require('../constants/ResourceConstants.es6')
const EventEmitter = require('events').EventEmitter

const CHANGE_EVENT = 'store_contents_change'

module.exports = Object.assign({}, EventEmitter.prototype, {
  emitChange() {
    this.emit(CHANGE_EVENT)
  }

  , addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback)
  }

  , removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback)
  }  
})
  