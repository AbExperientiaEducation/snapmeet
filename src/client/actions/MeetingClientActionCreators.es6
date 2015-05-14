const MeetgunDispatcher = require('../dispatcher/MeetgunDispatcher.es6')
const ResourceConstants = require('../../shared/constants/ResourceConstants.es6')
const ActionTypes = ResourceConstants.Meeting.ActionTypes

module.exports = {
  createNewMeeting() {
    MeetgunDispatcher.dispatch({
      type: ActionTypes.CLIENT_CREATE
    })
  }

  , addCurrentUserToMeeting(meetingId) {
    MeetgunDispatcher.dispatch({
      type: ResourceConstants.OtherActions.ASSOCIATE_TO_USER
      , id: meetingId
      , associatedRecordType: ResourceConstants.Meeting.LABEL
    })
  }
}
