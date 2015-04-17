const ServerResourceActionCreators = require('../actions/ServerResourceActionCreators.es6')
var reqwest = require('reqwest')
var co = require('co')

class MGResource {
  constructor(opts) {
    this.rootPath = '/api' + opts.resourcePath
    this.serializer = opts.serializer
    this.type = opts.type
  }

  saveNew(resource) {
    const serializedResource = this.serializer(resource)
    const _this = this
    co(function* (){
      const rawResource = yield reqwest({
        url: _this.rootPath + '/create'
        , method: 'post'
        , data: serializedResource
      })
      ServerResourceActionCreators.receiveCreated(_this.type, rawResource)
    }) 
  }

  getAll() {
    const _this = this
    co(function* (){
      const rawResources = yield reqwest(_this.rootPath)
      ServerResourceActionCreators.receiveAll(_this.type, rawResources)           
    })
  }
}

module.exports = MGResource
