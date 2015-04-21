const Immutable = require('immutable')
const Shortid = require('shortid')
const MeetingRecord = Immutable.Record({
  id: null
  , timestamp: null
})

module.exports = {
  // Create a new meeting record
  createNewMeeting() {
    return new MeetingRecord({
      id: Shortid.generate()
      , timestamp: Date.now()
    })
  }

  // Take meeting JSON from db and turn it into a meeting record
  , convertRawMeeting(rawMeeting) {
    return new MeetingRecord(rawMeeting.properties)
  }

}