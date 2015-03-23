const MeetgunDispatcher = require('../dispatcher/MeetgunDispatcher.es6')
const MeetingConstants = require('../constants/MeetingConstants.es6');
const MeetingUtils = require('../utils/MeetingUtils.es6')
const EventEmitter = require('events').EventEmitter

const CHANGE_EVENT = 'change'
const ActionTypes = MeetingConstants.ActionTypes

const _meetings = {}

const _addMeetings = (rawMeetings) => {
  rawMeetings.forEach( (meeting) => {
    if (!_meetings[meeting.id]) {
      _meetings[meeting.id] = MeetingUtils.convertRawMeeting(meeting)
    }
  })
}

const MeetingStore = Object.assign({}, EventEmitter.prototype, {
  emitChange: function() {
    this.emit(CHANGE_EVENT)
  }

  , addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback)
  }

  , removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback)
  }

  , get: (id) => {
    return _meetings[id]
  }

  , getAll: () => {
    return _meetings
  }
})

MeetingStore.dispatchToken = MeetgunDispatcher.register((action) => {
  switch(action.type) {
    case ActionTypes.CREATE_MEETING:
      console.log('create')
      const meeting = MeetingUtils.getCreatedMeetingData()
      _meetings[meeting.id] = meeting
      break;

    case ActionTypes.RECEIVE_RAW_MEETINGS:
      console.log('raw')
      _addMeetings(action.rawMeetings)
      MeetingStore.emitChange()
      break;

    default:
      // no op
    }
})

module.exports = MeetingStore
