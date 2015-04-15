const MeetgunDispatcher = require('../dispatcher/MeetgunDispatcher.es6')
const MeetingConstants = require('../constants/MeetingConstants.es6')

const ActionTypes = MeetingConstants.ActionTypes;

module.exports = {

  receiveAll(rawMeetings) {
    MeetgunDispatcher.dispatch({
      type: ActionTypes.RECEIVE_RAW_MEETINGS
      , rawMeetings: rawMeetings
    })
  }

  , receiveCreatedMeeting(createdMeeting) {
    MeetgunDispatcher.dispatch({
      type: ActionTypes.RECEIVE_RAW_MEETINGS
      , rawMeetings: [createdMeeting]
    })
  }

}