const DBMeetings = require('../db/meetings.es6')
const socketIOServer = require('../utils/SocketIOUtils.es6')
const ResourceConstants = require('../../shared/constants/ResourceConstants.es6')
const RestActions = ResourceConstants.RestActions

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
    }
  }
  socketIOServer.registerResourceHandler(ResourceConstants.Meeting.LABEL, handler)
}

module.exports = {
  register: register
}
