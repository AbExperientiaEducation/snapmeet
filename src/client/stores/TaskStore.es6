const ResourceConstants = require('../../shared/constants/ResourceConstants.es6')
const TaskResource = require('../utils/TaskResource.es6')
const MGResourceStore = require('../utils/MGResourceStore.es6')

const TaskStore = new MGResourceStore({
  type: ResourceConstants.Task.LABEL
  , ResourceAPI: TaskResource
  , createAction: ResourceConstants.Task.ActionTypes.CREATE
  , createFn: (data) => TaskResource.createNewRecord({meetingId: data.meetingId})
})

module.exports = TaskStore
