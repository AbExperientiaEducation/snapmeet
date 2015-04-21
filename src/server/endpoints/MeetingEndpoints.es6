const co = require('co')
const DBMeetings = require('../db/meetings.es6')
const socketIOServer = require('../utils/SocketIOUtils.es6')
const ResourceConstants = require('../../shared/constants/ResourceConstants.es6')
const RestActions = ResourceConstants.RestActions

const getMeetings = function() {
  return DBMeetings.fetchAll()   
}

const createMeeting = function(data) {
  const meetingJson = data.resource
  return DBMeetings.create(meetingJson)
}

const register = function() {
  const handler = function(data) {
    switch(data.action) {
      case RestActions.GET:
        return getMeetings()
      case RestActions.POST:
        return createMeeting(data)
    }
  }
  socketIOServer.registerResourceHandler(ResourceConstants.Meeting.LABEL, handler)
}

module.exports = {
  register: register
}
