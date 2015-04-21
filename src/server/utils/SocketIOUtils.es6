const socketio = require('socket.io')
const co = require('co')
const handlers = {}
const ResourceConstants = require('../../shared/constants/ResourceConstants.es6')

const registerResourceHandler = function(resourceType, callback) {
  handlers[resourceType] = callback
}

const groupReturnedResources = function(resources) {
  const response = {}
  resources.forEach(function(resource){
    resource.labels.forEach(function(label){
      label = label.toUpperCase()
      if(!response[label]) response[label] = []
      // Our JSON attrs are nested in a 'properties' has by DB. Unwrap them.
      response[label].push(resource.properties)
    })
    delete resource.labels
  })
  return response
}

const createServer = function(server){
  const ioServer = socketio(server)
  ioServer.on('connection', function(socket){
    console.log('a user connected')

    socket.on(ResourceConstants.REST_ACTION_EVENT, function(data) {
      try {
        const handler = handlers[data.type]
        if(handler) {
          co(function* (){
            const handlerResponse = yield handler(data)
            const response = groupReturnedResources(handlerResponse)
            switch(data.action) {
              case ResourceConstants.RestActions.GET:
                socket.emit(ResourceConstants.REST_RESPONSE_EVENT, response)
                break
              case ResourceConstants.RestActions.POST:
                // TODO: Broadcast is too broad here (only want to send to people on the slack team)
                socket.broadcast.emit(ResourceConstants.REST_RESPONSE_EVENT, response)
                socket.emit(ResourceConstants.REST_RESPONSE_EVENT, response)
                break
            }

          })
        } else {
          throw('unhandled resource type: ' + data.type)
        }        
      }
      catch(err) {
        console.log('socket.io Error', err.name, err.stack)
      }
    })
  })
  return ioServer
}

module.exports = {
  createServer: createServer
  , registerResourceHandler: registerResourceHandler
}

