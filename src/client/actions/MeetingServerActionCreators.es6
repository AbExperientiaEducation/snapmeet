const MeetgunDispatcher = require('../dispatcher/MeetgunDispatcher.es6')
const MeetingConstants = require('../constants/MeetingConstants.es6')

const ActionTypes = MeetingConstants.ActionTypes;

module.exports = {

  receiveAll: function(rawMeetings) {
    MeetgunDispatcher.dispatch({
      type: ActionTypes.RECEIVE_RAW_MEETINGS
      , rawMeetings: rawMeetings
    })
  }

  , receiveCreatedMeeting: function(createdMeeting) {
    MeetgunDispatcher.dispatch({
      type: ActionTypes.RECEIVE_RAW_MEETINGS
      , rawMeetings: [createdMeeting]
    })
  }

}