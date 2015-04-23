const MeetgunDispatcher = require('../dispatcher/MeetgunDispatcher.es6')
const ResourceConstants = require('../../shared/constants/ResourceConstants.es6')
const MeetingResource = require('../utils/MeetingResource.es6')
const Immutable = require('immutable')
const PubSubStore = require('../utils/PubSubStore.es6')
const ResourceName = ResourceConstants.Meeting.LABEL
const ActionTypes = ResourceConstants.Meeting.ActionTypes

let _meetings = Immutable.Map()
let _subscribedMeetings = Immutable.Map()

const _subscribeToMeeting = (meetingId) => {
  if(_subscribedMeetings.get(meetingId)) return
  MeetingResource.subscribeToMeeting(meetingId)
  _subscribedMeetings = _subscribedMeetings.set(meetingId, true)
}

const _addMeetings = (rawMeetings) => {
  rawMeetings.forEach( (meeting) => {
    // Always add to _meetings, or replace whatever was there.
    _meetings = _meetings.set(meeting.id, MeetingResource.inflateRecord(meeting))
  })
}

const MeetingStore = Object.assign({}, PubSubStore, {
  get(id) {
    _subscribeToMeeting(id)
    return _meetings.get(id)
  }

  , getAll() {
    return _meetings
  }
})

MeetingStore.dispatchToken = MeetgunDispatcher.register((action) => {
  switch(action.type) {
    case ActionTypes.CREATE:
      MeetingResource.createNewRecord({})
      break;

    case ResourceConstants.RECEIVE_RAW_EVENT:
      if(!action.groupedRawResources[ResourceName]) return
      _addMeetings(action.groupedRawResources[ResourceName])
      MeetingStore.emitChange()
      break;

    default:
      // no op
    }
})

module.exports = MeetingStore
