const socketio = require('socket.io')
const co = require('co')
const handlers = {}
const ResourceConstants = require('../../shared/constants/ResourceConstants.es6')
const _ = require('lodash')

const registerResourceHandler = function(resourceType, callback) {
  handlers[resourceType] = callback
}

const calculateResourceChannels = function(response, resourceType) {
  const channels = _.pluck(response[resourceType], 'id')
  
  if(response.RELATIONS) {
    // We need to notify anyone that has any of the related items
    response.RELATIONS.forEach(rel => {
      channels.push(rel.Node1Id, rel.Node2Id)
    })
  }
  return _.uniq(channels)
}

const runHandlerForData = function(data, socket) {
  try {
    const handler = handlers[data.type]
    if(!handler) throw('unhandled resource type: ' + data.type)
    co(function* (){
      try {
        const response = yield handler(data, socket.request.user.id)
        switch(data.action) {
          case ResourceConstants.RestActions.GET:
          case ResourceConstants.RestActions.GET_BATCH:
            socket.emit(ResourceConstants.REST_RESPONSE_EVENT, response)
            break

          case ResourceConstants.RestActions.PATCH:
          case ResourceConstants.RestActions.POST:
            const channels = calculateResourceChannels(response, data.type)
            channels.forEach(channel => {
              socket.broadcast.to(channel).emit(ResourceConstants.REST_RESPONSE_EVENT, response)  
            })
        
            socket.emit(ResourceConstants.REST_RESPONSE_EVENT, response)
            break
        }

        if(data.subscribe) {
          // TODO: Add security to verify socket eligible to join resource
          // TODO: Is there a race condition here? What if changes came in while we were fetching?
          const ids = data.ids || [data.id]
          ids.forEach(id => {socket.join(data.id)})
        }        
      }
      catch(err) {
        console.error(err.stack)
      }
    })
  }
  
  catch(err) {
    console.error('socket.io Error', data, err, err.stack)
  }
}

const createServer = function(server){
  const ioServer = socketio(server)
  ioServer.on('connection', function(socket){
    console.log('a user connected')

    socket.on(ResourceConstants.REST_ACTION_EVENT, function(data) {
      runHandlerForData(data, socket) 
    })
  })
  return ioServer
}

module.exports = {
  createServer: createServer
  , registerResourceHandler: registerResourceHandler
}

