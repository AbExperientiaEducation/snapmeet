const SocketIOStore = require('../stores/SocketIOStore.es6')
const ResourceConstants = require('../../shared/constants/ResourceConstants.es6')
const Actions = ResourceConstants.RestActions
const Immutable = require('immutable')
const Shortid = require('shortid')
const ServerResourceActionCreators = require('../actions/ServerResourceActionCreators.es6')

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

  makeRestCall(restAction, data) {
    data = Object.assign({
      resourceType: this.type
      , action: restAction
    }, data)
    this.socket.emit(ResourceConstants.REST_ACTION_EVENT, data)
  }

  subscribeToResource(id) {
    this.makeRestCall(Actions.GET, {subscribe: true, id: id})
  }

  subscribeToResources(ids) {
    this.makeRestCall(Actions.GET_BATCH, {subscribe: true, ids: ids})
  }

  inflateRecord(rawRecord) {
    return new this.Record(rawRecord)
  }

  createNewRecord(properties) {
    const rawResource = Object.assign(properties, {
      id: Shortid.generate()
      , createdTimestamp: Date.now()
    })

    this.makeRestCall(Actions.POST, { resource: rawResource })
    const resources = {}
    resources[this.type] = [rawResource]
    setTimeout(function(){ServerResourceActionCreators.receiveResources(resources)}, 0)    
  }

  updateRecord(record) {
    this.makeRestCall(Actions.PATCH, { resource: record})
    const resources = {}
    resources[this.type] = [record]
    setTimeout(function(){ServerResourceActionCreators.receiveResources(resources)}, 0)    
  }
}

module.exports = MGResource
