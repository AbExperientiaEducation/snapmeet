const SMResource = require('./SMResource.es6')
const ResourceConstants = require('../../shared/constants/ResourceConstants.es6')

const TaskResource = new SMResource({
  type: ResourceConstants.Task.LABEL
  , recordProperties: {
      dueTimestamp: null
      , assignees: []
      , completed: false
    }
})

module.exports = TaskResource
