const Immutable = require('immutable')
const Shortid = require('shortid')
const MeetingRecord = Immutable.Record({
  id: null
  , date: null
  , persisted: null
})

module.exports = {
  // Create a new meeting record
  createNewMeeting: () => {
    const date = new Date()
    // const 
    return new MeetingRecord({
      id: Shortid.generate()
      , date: date
      , persisted: false
    })
  }

  // Take meeting JSON from db and turn it into a meeting record
  , convertRawMeeting: (rawMeeting) => {
    return new MeetingRecord({
        id: rawMeeting.properties.id  
        , date: new Date(rawMeeting.properties.timestamp)
        , persisted: true
      })
  }

  // convert a meeting record to db-friendly JSON
  , jsonifyMeeting: (meeting) => {
    return {
      id: meeting.id
      , timestamp: meeting.date.getTime()
    }
  }
}