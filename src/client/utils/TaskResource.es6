const MGResource = require('./MGResource.es6')
const ResourceConstants = require('../constants/ResourceConstants.es6')
const TaskUtils = require('../../shared/utils/TaskUtils.es6')

const TaskResource = new MGResource({
  resourcePath: '/tasks'
  , serializer: TaskUtils.jsonifyTask
  , type: ResourceConstants.ResourceTypes.TASK
})

module.exports = TaskResource
