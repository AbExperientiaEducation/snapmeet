const SocketIOStore = require('../stores/SocketIOStore.es6')
const ResourceConstants = require('../../shared/constants/ResourceConstants.es6')

class MGResource {
  constructor(opts) {
    this.type = opts.type
    SocketIOStore.getSocket()
  }

  saveNew(resource) {
    SocketIOStore.getSocket().emit(
      ResourceConstants.REST_ACTION_EVENT
      , {
        type: this.type
        , action: ResourceConstants.RestActions.POST
        , resource: resource
      }
    )
  }

  getAll() {
    SocketIOStore.getSocket().emit(
      ResourceConstants.REST_ACTION_EVENT
      , {
        type: this.type
        , action: ResourceConstants.RestActions.GET
      }
    )
  }
}

module.exports = MGResource
