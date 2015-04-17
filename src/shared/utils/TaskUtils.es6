const Immutable = require('immutable')
const Shortid = require('shortid')
const TaskRecord = Immutable.Record({
  id: null
  , meetingId: null
  , created: null
  , due: null
  , title: null
  , assignees: []
  , persisted: null
})

module.exports = {
  // Create a new meeting record
  createNewTask(meetingId) {
    return new TaskRecord({
      id: Shortid.generate()
      , meetingId: meetingId
      , created: new Date()
      , persisted: false
    })
  }

  // Take JSON from db and turn it into a record
  , convertRawTask(rawTask) {
    return new TaskRecord({
        id: rawTask.properties.id  
        , meetingId: rawTask.meetingId
        , created: new Date(rawTask.properties.createdTimestamp)
        , due: rawTask.dueTimestamp ? new Date(rawTask.properties.dueTimestamp) : null
        , title: rawTask.properties.title
        , assignees: rawTask.properties.assignees
        , persisted: true
      })
  }

  // convert a meeting record to db-friendly JSON
  , jsonifyTask(task) {
    return {
      id: task.id
      , meetingId: task.meetingId
      , createdTimestamp: task.created.getTime()
      , dueTimestamp: task.due && task.getTime() || null
      , title: task.title
      , assignees: task.assignees
    }
  }

  , castTaskJson(taskJson) {
    taskJson.createdTimestamp = parseInt(taskJson.createdTimestamp)
    return taskJson
  }

}
