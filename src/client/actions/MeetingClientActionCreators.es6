const SnapmeetDispatcher = require('../dispatcher/SnapmeetDispatcher.es6')
const ResourceConstants = require('../../shared/constants/ResourceConstants.es6')
const ActionTypes = ResourceConstants.Meeting.ActionTypes

module.exports = {
  createNewMeeting() {
    SnapmeetDispatcher.dispatch({
      type: ActionTypes.CLIENT_CREATE
    })
  }

  , addCurrentUserToMeeting(meetingId) {
    SnapmeetDispatcher.dispatch({
      type: ResourceConstants.OtherActions.ASSOCIATE_TO_USER
      , id: meetingId
      , associatedRecordType: ResourceConstants.Meeting.LABEL
    })
  }
}
