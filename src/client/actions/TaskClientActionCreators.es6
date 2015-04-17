const MeetgunDispatcher = require('../dispatcher/MeetgunDispatcher.es6')
const ResourceConstants = require('../constants/ResourceConstants.es6')
const ActionTypes = ResourceConstants.ActionTypes.TASK

module.exports = {
  createNewTask(meetingId) {
    MeetgunDispatcher.dispatch({
      type: ActionTypes.CREATE
      , meetingId: meetingId
    })
  }
}
