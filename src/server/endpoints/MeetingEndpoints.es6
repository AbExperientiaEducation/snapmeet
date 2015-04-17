const co = require('co')
const DBMeetings = require('../db/meetings.es6')
const MeetingUtils = require('../../shared/utils/MeetingUtils.es6')

const register = function(app) {
  app.get('/api/meetings', function(req, res) {
    co(function* (){
      const meetings = yield DBMeetings.fetchAll() 
      res.json(meetings)
    })
  })

  app.post('/api/meetings/create', function(req, res){
    const meetingJson = MeetingUtils.castMeetingJson(req.body)
    co(function* (){
      const meetingResponse = yield DBMeetings.create(meetingJson)
      res.json(meetingResponse[0])
    })
  })
}

module.exports = {
  register: register
}