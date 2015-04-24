const MeetgunDispatcher = require('../dispatcher/MeetgunDispatcher.es6')
const ResourceConstants = require('../../shared/constants/ResourceConstants.es6')
const ActionTypes = ResourceConstants.Meeting.ActionTypes

module.exports = {
  createNewMeeting() {
    MeetgunDispatcher.dispatch({
      type: ActionTypes.CREATE
      , orgId: '*TEST*'
    })
  }

}