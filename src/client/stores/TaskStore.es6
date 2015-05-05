const ResourceConstants = require('../../shared/constants/ResourceConstants.es6')
const TaskResource = require('../resources/TaskResource.es6')
const MGResourceStore = require('../utils/MGResourceStore.es6')

const TaskStore = new MGResourceStore({
  constants: ResourceConstants.Task
  , ResourceAPI: TaskResource
  , createFn: (data) => TaskResource.createNewRecord({meetingId: data.meetingId})
})

module.exports = TaskStore
