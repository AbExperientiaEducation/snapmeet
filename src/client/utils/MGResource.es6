const SocketIOStore = require('../stores/SocketIOStore.es6')
const ResourceConstants = require('../../shared/constants/ResourceConstants.es6')
const Actions = ResourceConstants.RestActions
const Immutable = require('immutable')
const Shortid = require('shortid')

class MGResource {
  constructor(opts) {
    this.type = opts.type
    this.socket = SocketIOStore.getSocket()

    const recordProperties = Object.assign(opts.recordProperties, {
      id: null
      , createdTimestamp: null
    })
    this.Record = Immutable.Record(recordProperties)
  }

  makeRestCall(restAction, data){
    data = Object.assign({
      type: this.type
      , action: restAction
    }, data)
    this.socket.emit(ResourceConstants.REST_ACTION_EVENT, data)
  }

  saveNew(resource) {
    this.makeRestCall(Actions.POST, {
      resource: resource
    })
  }

  getAll() {
    this.makeRestCall(Actions.GET)
  }

  inflateRecord(rawRecord) {
    return new this.Record(rawRecord.properties)
  }

  newRecord(properties) {
    const properties = Object.assign(properties, {
      id: Shortid.generate()
      , createdTimestamp: Date.now()
    })
    return new this.Record(properties)
  }
}

module.exports = MGResource
