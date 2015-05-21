const ResourceConstants = require('../../shared/constants/ResourceConstants.es6')
const TaskResource = require('../resources/TaskResource.es6')
const SMResourceStore = require('./SMResourceStore.es6')

const TaskStore = new SMResourceStore({
  constants: ResourceConstants.Task
  , ResourceAPI: TaskResource
  , createFn: (data) => TaskResource.createNewRecord({meetingId: data.meetingId})
})

module.exports = TaskStore
