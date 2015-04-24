const DBMeetings = require('../db/meetings.es6')
const socketIOServer = require('../utils/SocketIOUtils.es6')
const ResourceConstants = require('../../shared/constants/ResourceConstants.es6')
const RestActions = ResourceConstants.RestActions
const OtherActions = ResourceConstants.OtherActions

const getMeetings = function(data) {
  if(data.id) {
    return DBMeetings.getWithRelations(data.id)
  }
}

const createMeeting = function(data) {
  const meetingJson = data.resource
  return DBMeetings.create(meetingJson)
}

const register = function() {
  const handler = function(data) {
    switch(data.action) {
      case RestActions.GET:
        return getMeetings(data)
      case RestActions.POST:
        return createMeeting(data)
      case OtherActions.SUBSCRIBE:
        return getRelations(data)
    }
  }
  socketIOServer.registerResourceHandler(ResourceConstants.Meeting.LABEL, handler)
}

module.exports = {
  register: register
}
