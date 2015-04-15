const MeetgunDispatcher = require('../dispatcher/MeetgunDispatcher.es6')
const MeetingConstants = require('../constants/MeetingConstants.es6');
const MeetingUtils = require('../../shared/utils/MeetingUtils.es6')
const MeetingWebAPIUtils = require('../utils/MeetingWebAPIUtils.es6')
const Immutable = require('immutable')
const EventEmitter = require('events').EventEmitter

const CHANGE_EVENT = 'change'
const ActionTypes = MeetingConstants.ActionTypes

let _meetings = Immutable.Map()

const _addMeetings = (rawMeetings) => {
  rawMeetings.forEach( (meeting) => {
    // Always add to _meetings, or replace whatever was there.
    _meetings = _meetings.set(meeting.properties.id, MeetingUtils.convertRawMeeting(meeting))
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
    return _meetings.get(id)
  }

  , getAll: () => {
    return _meetings
  }
})

MeetingStore.dispatchToken = MeetgunDispatcher.register((action) => {
  switch(action.type) {
    case ActionTypes.CREATE_MEETING:
      const meeting = MeetingUtils.createNewMeeting()
      MeetingWebAPIUtils.saveMeeting(meeting)
      _meetings[meeting.id] = meeting
      MeetingStore.emitChange()
      break;

    case ActionTypes.RECEIVE_RAW_MEETINGS:
      _addMeetings(action.rawMeetings)
      MeetingStore.emitChange()
      break;

    default:
      // no op
    }
})

module.exports = MeetingStore
