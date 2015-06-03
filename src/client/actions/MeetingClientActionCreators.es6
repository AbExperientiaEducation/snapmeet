const SnapmeetDispatcher = require('../dispatcher/SnapmeetDispatcher.es6')
const ResourceConstants = require('../../shared/constants/ResourceConstants.es6')
const UIConstants = require('../constants/UIConstants.es6')
const SocketConstants = require('../../shared/constants/SocketEventConstants.es6')
const ActionTypes = ResourceConstants.Meeting.ActionTypes
const PresenceTracking = require('../utils/PresenceTracking.es6')

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

  , openVideoChat() {
    SnapmeetDispatcher.dispatch({
      type: UIConstants.VC_OPENED
    })
  }

  , closeVideoChat() {
    SnapmeetDispatcher.dispatch({
      type: UIConstants.VC_CLOSED
    })
  }

  , joinPresence(resourceId, resourceType) {
    PresenceTracking.presenceJoin(resourceId, resourceType)
  }

  , leavePresence(resourceId, resourceType) {
    PresenceTracking.presenceLeave(resourceId, resourceType)
  }
}
