const socketio = require('socket.io')
const co = require('co')
const handlers = {}
const ResourceConstants = require('../../shared/constants/ResourceConstants.es6')
const _ = require('lodash')
const SignalMaster = require('./SignalMaster.es6')
const ErrorLogger = require('../../shared/utils/ErrorLogger.es6')

let _ioServer

const registerResourceHandler = function(resourceType, callback) {
  handlers[resourceType] = callback
}

const broadcastChange = function(resourceType, groupedResources) {
  const channels = _.map(groupedResources[resourceType], r => {return resourceType + r.id})

  if(groupedResources.RELATIONS) {
    // We need to notify anyone that has any of the related items
    groupedResources.RELATIONS.forEach(rel => {
      channels.push(rel.Node1Type.toUpperCase() + rel.Node1Id, rel.Node2Type.toUpperCase() + rel.Node2Id)
    })
  }

  _.uniq(channels).forEach(channel => {
    _ioServer.to(channel).emit(ResourceConstants.REST_RESPONSE_EVENT, groupedResources)  
  })
}

const runHandlerForData = function(data, socket) {
  try {
    const handler = handlers[data.resourceType]
    if(!handler) throw('unhandled resource type: ' + data.resourceType)
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
          case ResourceConstants.OtherActions.ASSOCIATE_TO_USER:
            broadcastChange(data.resourceType, response)
            socket.emit(ResourceConstants.REST_RESPONSE_EVENT, response)
            break
        }

        if(data.subscribe) {
          // TODO: Add security to verify socket eligible to join resource
          // TODO: Is there a race condition here? What if changes came in while we were fetching?
          const ids = data.ids || [data.id]
          ids.forEach(id => {socket.join(data.resourceType + id)})
        }        
      }
      catch(err) {
        ErrorLogger.log(err)
      }
    })
  }
  
  catch(err) {
    err.message = "Socket.io Error " + err.message
    ErrorLogger.log(err, data)
  }
}

const createServer = function(server){
  if(_ioServer) throw("Attempted to create duplicate server")
  _ioServer = socketio(server)
  _ioServer.on('connection', function(socket){
    console.log('a user connected')
    SignalMaster.setup(socket, _ioServer)

    socket.on(ResourceConstants.REST_ACTION_EVENT, function(data) {
      runHandlerForData(data, socket) 
    })
  })
  return _ioServer
}

module.exports = {
  createServer: createServer
  , registerResourceHandler: registerResourceHandler
  , broadcastChange: broadcastChange
}
