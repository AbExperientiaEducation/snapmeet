const SnapmeetDispatcher = require('../dispatcher/SnapmeetDispatcher.es6')
const ResourceConstants = require('../../shared/constants/ResourceConstants.es6')
const ActionTypes = ResourceConstants.Task.ActionTypes

module.exports = {
  createNewTask(meetingId) {
    SnapmeetDispatcher.dispatch({
      type: ActionTypes.CLIENT_CREATE
      , meetingId: meetingId
    })
  }

  , setTaskCompletion(task, isComplete) {
    task = task.set('completed', isComplete)
    SnapmeetDispatcher.dispatch({
      type: ActionTypes.CLIENT_PATCH
      , record: task
    })
  }
}
