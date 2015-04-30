const DBMeetings = require('../db/meetings.es6')
const socketIOServer = require('../utils/SocketIOUtils.es6')
const ResourceConstants = require('../../shared/constants/ResourceConstants.es6')
const RestActions = ResourceConstants.RestActions
const OtherActions = ResourceConstants.OtherActions

const getMeetings = function(data) {
  const ids = data.ids || [data.id] 
  return DBMeetings.getWithRelations(ids)
}

const createMeeting = function(data, userId) {
  const meetingJson = data.resource
  meetingJson.userId = userId
  return DBMeetings.create(meetingJson)
}

const register = function() {
  const handler = function(data, userId) {
    switch(data.action) {
      case RestActions.GET:
        return getMeetings(data)
      case RestActions.GET_BATCH:
        return getMeetings(data)
      case RestActions.POST:
        return createMeeting(data, userId)
      case OtherActions.SUBSCRIBE:
        return getRelations(data)
    }
  }
  socketIOServer.registerResourceHandler(ResourceConstants.Meeting.LABEL, handler)
}

module.exports = {
  register: register
}
