const MeetgunDispatcher = require('../dispatcher/MeetgunDispatcher.es6')
const ResourceConstants = require('../../shared/constants/ResourceConstants.es6')
const TaskResource = require('../utils/TaskResource.es6')
const Immutable = require('immutable')
const PubSubStore = require('../utils/PubSubStore.es6')
const ActionTypes = ResourceConstants.Task.ActionTypes
const RelationStore = require('./RelationStore.es6')
const _ = require('lodash')

let _tasks = Immutable.Map()
let _subscribedTasks = Immutable.Map()

const _subscribeToTask = (taskId) => {
  if(_subscribedTasks.get(taskId)) return
  TaskResource.subscribeToResource(taskId)
  _subscribedTasks = _subscribedTasks.set(taskId, true)
}


const _addTasks = (rawTasks) => {
  rawTasks.forEach( (task) => {
    // Always add to _tasks, or replace whatever was there.
    _tasks = _tasks.set(task.id, TaskResource.inflateRecord(task))
  })
}

const TaskStore = Object.assign({}, PubSubStore, {
  get(id) {
    const task = _tasks.get(id)
    if(!task) TaskResource.get(id)
    return task
  }

  , getTasksForMeeting(meetingId) {
    const relations = RelationStore.getRelations(meetingId)
    if(relations && relations.MEETING_TASK) {
      const taskIds = relations.MEETING_TASK
      taskIds.forEach(id => _subscribeToTask(id))  
      return _tasks.filter(t => taskIds.indexOf(t.id) > -1)
    } else {
      return null
    }
    
    
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
