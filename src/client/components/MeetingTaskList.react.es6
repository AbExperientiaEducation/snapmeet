const React = require('react')
const PureRenderMixin = require('react/addons').addons.PureRenderMixin
const TaskStore = require('../stores/TaskStore.es6')
const RelationStore = require('../stores/RelationStore.es6')
const TaskListItem = require('./TaskListItem.react.es6')

const getStateFromStore = (props) => {
  return {
    tasks: TaskStore.getResourcesFromRelation(props.meetingId, 'MEETING_TASK')
  }
}

const getTaskListItem = (task) => {
  return (
    <TaskListItem id={ task.id } />
  )
}

const MeetingTaskList = React.createClass({
  mixins: [PureRenderMixin]

  , getInitialState() {
    return getStateFromStore(this.props)
  }

  , componentDidMount() {
    TaskStore.addChangeListener(this._onChange)
    RelationStore.addChangeListener(this._onChange)
  }

  , componentWillUnmount() {
    TaskStore.removeChangeListener(this._onChange)
    RelationStore.removeChangeListener(this._onChange)
  }

  , render() {
    if(this.state.tasks) {
      const taskListItems = this.state.tasks.map(getTaskListItem)
      const meetingId = this.props.meetingId
      return (
        <div className="task-list">
          <ul>
            {taskListItems}
          </ul>
        </div>
      )      
    } else {
      return (
        <div>Loading...</div>
      )
    }
  }

  , _onChange() {
    this.setState(getStateFromStore(this.props))
  }
})

module.exports = MeetingTaskList
