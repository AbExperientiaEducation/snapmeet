const MeetgunDispatcher = require('../dispatcher/MeetgunDispatcher.es6')
const MeetingConstants = require('../constants/MeetingConstants.es6')
const ActionTypes = MeetingConstants.ActionTypes;

module.exports = {

  createNewMeeting: function() {
    MeetgunDispatcher.dispatch({
      type: ActionTypes.CREATE_MEETING
    })
  }

}