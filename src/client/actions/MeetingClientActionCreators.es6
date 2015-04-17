const MeetgunDispatcher = require('../dispatcher/MeetgunDispatcher.es6')
const ResourceConstants = require('../constants/ResourceConstants.es6')
const ActionTypes = ResourceConstants.ActionTypes.MEETING;

module.exports = {
  createNewMeeting() {
    MeetgunDispatcher.dispatch({
      type: ActionTypes.CREATE
    })
  }

}