const MGResource = require('./MGResource.es6')
const ResourceConstants = require('../../shared/constants/ResourceConstants.es6')

const TaskResource = new MGResource({
  type: ResourceConstants.Task.LABEL
  , recordProperties: {
      meetingId: null
      , dueTimestamp: null
      , title: null
      , assignees: []
    }
})

TaskResource.getAllForMeeting = function(meetingId){
  this.makeRestCall(ResourceConstants.RestActions.GET, {
    meetingId: meetingId
  })
}

module.exports = TaskResource
