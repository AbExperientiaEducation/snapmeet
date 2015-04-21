const co = require('co')
const DBTasks = require('../db/tasks.es6')
const socketIOServer = require('../utils/SocketIOUtils.es6')
const ResourceConstants = require('../../shared/constants/ResourceConstants.es6')
const RestActions = ResourceConstants.RestActions

const createTask = function(data) {
  const taskJson = data.resource
  return DBTasks.create(taskJson)
}

const getTasks = function(data) {
  return DBTasks.fetchAll(data.meetingId)   
}

const register = function() {
    const handler = function(data) {
    switch(data.action) {
      case RestActions.GET:
        return getMeetings()
      case RestActions.POST:
        return createTask(data)
    }
  }
  socketIOServer.registerResourceHandler(ResourceConstants.Task.LABEL, handler)
}

module.exports = {
  register: register
}
