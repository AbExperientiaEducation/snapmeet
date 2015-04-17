const MeetgunDispatcher = require('../dispatcher/MeetgunDispatcher.es6')
const ResourceConstants = require('../constants/ResourceConstants.es6')
const TaskUtils = require('../../shared/utils/TaskUtils.es6')
const TaskResource = require('../utils/TaskResource.es6')
const Immutable = require('immutable')
const PubSubStore = require('../utils/PubSubStore.es6')
const ActionTypes = ResourceConstants.ActionTypes.TASK

let _tasks = Immutable.Map()

const _addTasks = (rawTasks) => {
  rawTasks.forEach( (task) => {
    // Always add to _tasks, or replace whatever was there.
    _tasks = _tasks.set(task.properties.id, TaskUtils.convertRawTask(task))
  })
}

const TaskStore = Object.assign({}, PubSubStore, {
  get(id) {
    return _tasks.get(id)
  }

  , getAll() {
    return _tasks
  }
})

TaskStore.dispatchToken = MeetgunDispatcher.register((action) => {
  switch(action.type) {
    case ActionTypes.CREATE:
      const task = TaskUtils.createNewTask(action.meetingId)
      TaskResource.saveNew(task)
      _tasks[task.id] = task
      TaskStore.emitChange()
      break;

    case ActionTypes.RECEIVE_RAW:
      _addTasks(action.rawResources)
      TaskStore.emitChange()
      break;

    default:
      // no op
    }
})

module.exports = TaskStore
