const MeetgunDispatcher = require('../dispatcher/MeetgunDispatcher.es6')
const ResourceConstants = require('../../shared/constants/ResourceConstants.es6')
const ActionTypes = ResourceConstants.Meeting.ActionTypes

module.exports = {
  createNewTask(meetingId) {
    MeetgunDispatcher.dispatch({
      type: ActionTypes.CREATE
      , meetingId: meetingId
    })
  }
}
