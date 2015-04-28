const DBTasks = require('../db/tasks.es6')
const socketIOServer = require('../utils/SocketIOUtils.es6')
const ResourceConstants = require('../../shared/constants/ResourceConstants.es6')
const RestActions = ResourceConstants.RestActions

const createTask = function(data) {
  return DBTasks.create(data.resource)
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
  socketIOServer.registerResourceHandler(ResourceConstants.Task.LABEL, handler)
}

module.exports = {
  register: register
}
