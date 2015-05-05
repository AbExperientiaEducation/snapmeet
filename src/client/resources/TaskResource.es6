const MGResource = require('./MGResource.es6')
const ResourceConstants = require('../../shared/constants/ResourceConstants.es6')

const TaskResource = new MGResource({
  type: ResourceConstants.Task.LABEL
  , recordProperties: {
      dueTimestamp: null
      , assignees: []
      , completed: false
    }
})

module.exports = TaskResource
