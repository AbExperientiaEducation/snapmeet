const MeetgunDispatcher = require('../dispatcher/MeetgunDispatcher.es6')
const ResourceConstants = require('../../shared/constants/ResourceConstants.es6')
const TaskResource = require('../utils/TaskResource.es6')
const Immutable = require('immutable')
const PubSubStore = require('../utils/PubSubStore.es6')
const ActionTypes = ResourceConstants.Task.ActionTypes

let _tasks = Immutable.Map()

const _addTasks = (rawTasks) => {
  rawTasks.forEach( (task) => {
    // Always add to _tasks, or replace whatever was there.
    _tasks = _tasks.set(task.id, TaskResource.inflateRecord(task))
  })
}

const TaskStore = Object.assign({}, PubSubStore, {
  get(id) {
    return _tasks.get(id)
  }

  , getTasksForMeeting(meetingId) {
    return _tasks.filter(t => t.meetingId === meetingId)
  }
})

TaskStore.dispatchToken = MeetgunDispatcher.register((action) => {
  switch(action.type) {
    case ActionTypes.CREATE:
      TaskResource.createNewRecord({meetingId: action.meetingId})
      break;

    case ResourceConstants.RECEIVE_RAW_EVENT:
      if(!action.groupedRawResources[ResourceConstants.Task.LABEL]) return
      _addTasks(action.groupedRawResources[ResourceConstants.Task.LABEL])
      TaskStore.emitChange()
      break;

    default:
      // no op
    }
})

module.exports = TaskStore
