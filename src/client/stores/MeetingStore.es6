const MeetgunDispatcher = require('../dispatcher/MeetgunDispatcher.es6')
const ResourceConstants = require('../../shared/constants/ResourceConstants.es6')
const MeetingUtils = require('../../shared/utils/MeetingUtils.es6')
const MeetingWebAPIUtils = require('../utils/MeetingWebAPIUtils.es6')
const Immutable = require('immutable')
const PubSubStore = require('../utils/PubSubStore.es6')
const ResourceName = ResourceConstants.Meeting.LABEL
const ActionTypes = ResourceConstants.Meeting.ActionTypes

let _meetings = Immutable.Map()

const _addMeetings = (rawMeetings) => {
  rawMeetings.forEach( (meeting) => {
    // Always add to _meetings, or replace whatever was there.
    _meetings = _meetings.set(meeting.properties.id, MeetingUtils.convertRawMeeting(meeting))
  })
}

const MeetingStore = Object.assign({}, PubSubStore, {
  get(id) {
    return _meetings.get(id)
  }

  , getAll() {
    return _meetings
  }
})

MeetingStore.dispatchToken = MeetgunDispatcher.register((action) => {
  switch(action.type) {
    case ActionTypes.CREATE:
      const meeting = MeetingUtils.createNewMeeting()
      MeetingWebAPIUtils.saveNew(meeting)
      _addMeetings([{properties: meeting}])
      MeetingStore.emitChange()
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
