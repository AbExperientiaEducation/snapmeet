const co = require('co')
const denodeify = require('denodeify')
const DBTasks = require('../db/tasks.es6')
const socketIOUtils = require('../utils/SocketIOUtils.es6')
const ResourceConstants = require('../../shared/constants/ResourceConstants.es6')
const RestActions = ResourceConstants.RestActions
const SyncDocHandling = require('../utils/SyncDocHandling.es6')
const SocketEventConstants = require('../../shared/constants/SocketEventConstants.es6')
const ErrorLogger = require('../../shared/utils/ErrorLogger.es6')

const createTask = function(data) {
  return co(function* (){
    try {
      const client = SyncDocHandling.getClient()
      const docCreator = denodeify(client.backend.submit.bind(client.backend))
      yield docCreator('docs', data.resource.id + SocketEventConstants.TASK_SUFFIX, {create: {type: 'text', data: ''}}, {})
      const neoResult = yield DBTasks.create(data.resource)
      return neoResult
    } catch(err) {
      ErrorLogger.log(err, 'Task Creation Failed')
    }
  })
}

const updateTask = function(data) {
  return DBTasks.update(data.resource)
}

const getTasks = function(data) {
  const ids = data.ids || [data.id] 
  return DBTasks.getWithRelations(ids)
}

const register = function() {
    const handler = function(data) {
    switch(data.action) {
      case RestActions.GET:
      case RestActions.GET_BATCH:
        return getTasks(data)
      case RestActions.POST:
        return createTask(data)
      case RestActions.PATCH:
        return updateTask(data)
    }
  }
  socketIOUtils.registerResourceHandler(ResourceConstants.Task.LABEL, handler)
}

module.exports = {
  register: register
}
