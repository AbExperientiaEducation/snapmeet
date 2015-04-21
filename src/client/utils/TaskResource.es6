const MGResource = require('./MGResource.es6')
const ResourceConstants = require('../../shared/constants/ResourceConstants.es6')
const TaskUtils = require('../../shared/utils/TaskUtils.es6')

const TaskResource = new MGResource({
resourcePath: '/tasks'
  , type: ResourceConstants.Task.LABEL
})

module.exports = TaskResource
