const MeetingServerActionCreators = require('../actions/MeetingServerActionCreators.es6')
const MeetingUtils = require('../../shared/utils/MeetingUtils.es6')
var reqwest = require('reqwest')
var co = require('co')

module.exports = {

  saveNewMeeting: () => {
    co(function* (){
      const meeting = yield reqwest({
        url: '/api/meetings/create'
        , method: 'post'
        , data: {timestamp: Date.now()}
      })
    }) 
  }

  , saveMeeting: (meeting) => {
    const jsonifiedMeeting = MeetingUtils.jsonifyMeeting(meeting)
    co(function* (){
      const meeting = yield reqwest({
        url: '/api/meetings/create'
        , method: 'post'
        , data: jsonifiedMeeting
      })
      MeetingServerActionCreators.receiveCreatedMeeting(meeting)
    }) 
  }

  , getAllMeetings: () => {
    co(function* (){
      const data = yield reqwest('/api/meetings')
      MeetingServerActionCreators.receiveAll(data) 
    })
  }

}