const MeetgunDispatcher = require('../dispatcher/MeetgunDispatcher.es6')
const ResourceConstants = require('../../shared/constants/ResourceConstants.es6')
const ActionTypes = ResourceConstants.Task.ActionTypes

module.exports = {
  createNewTask(meetingId) {
    MeetgunDispatcher.dispatch({
      type: ActionTypes.CREATE
      , meetingId: meetingId
    })
  }

  , setTaskCompletion(task, isComplete) {
    task = task.set('completed', isComplete)
    MeetgunDispatcher.dispatch({
      type: ActionTypes.PATCH
      , record: task
    })

  }
}
