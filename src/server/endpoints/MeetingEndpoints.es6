const RichText = require('rich-text')
const co = require('co')
const denodeify = require('denodeify')
const SocketEventConstants = require('../../shared/constants/SocketEventConstants.es6')
const ErrorLogger = require('../../shared/utils/ErrorLogger.es6')
const SyncDocHandling = require('../utils/SyncDocHandling.es6')
const DBMeetings = require('../db/meetings.es6')
const socketIOServer = require('../utils/SocketIOUtils.es6')
const ResourceConstants = require('../../shared/constants/ResourceConstants.es6')
const RestActions = ResourceConstants.RestActions

const getMeetings = function(data) {
  const ids = data.ids || [data.id] 
  return DBMeetings.getWithRelations(ids)
}

const createMeeting = function(data, userId) {
  return co(function* (){
    try {
      const client = SyncDocHandling.getClient()
      const docCreator = denodeify(client.backend.submit.bind(client.backend))
      yield docCreator('docs', data.resource.id + SocketEventConstants.MEETING_NOTES_SUFFIX, {create: {type: RichText.type.name, data: ''}}, {})
      yield docCreator('docs', data.resource.id + SocketEventConstants.MEETING_TITLE_SUFFIX, {create: {type: 'text', data: ''}}, {})
      const meetingJson = Object.assign(data.resource, {userId: userId})
      const neoResult = yield DBMeetings.create(meetingJson)
      return neoResult
    } catch(err) {
      ErrorLogger.log(err, 'Task Creation Failed')
    }
  })
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
