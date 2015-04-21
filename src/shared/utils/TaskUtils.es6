const Immutable = require('immutable')
const Shortid = require('shortid')
const TaskRecord = Immutable.Record({
  id: null
  , meetingId: null
  , created: null
  , due: null
  , title: null
  , assignees: []
})

module.exports = {
  // Create a new meeting record
  createNewTask(meetingId) {
    return new TaskRecord({
      id: Shortid.generate()
      , meetingId: meetingId
      , createdTimestamp: Date.now()
    })
  }

  // Take JSON from db and turn it into a record
  , convertRawTask(rawTask) {
    return new TaskRecord({
        id: rawTask.properties.id  
        , meetingId: rawTask.properties.meetingId
        , createdTimestamp: rawTask.properties.createdTimestamp
        , dueTimestamp: rawTask.properties.dueTimestamp
        , title: rawTask.properties.title
        , assignees: rawTask.properties.assignees
      })
  }
}
