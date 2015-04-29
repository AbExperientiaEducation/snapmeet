const React = require('react')
const PureRenderMixin = require('react/addons').addons.PureRenderMixin
const TaskStore = require('../stores/TaskStore.es6')
const SyncField = require('./SyncField.react.es6')
const MUI = require('material-ui')
const TaskActionCreators = require('../actions/TaskClientActionCreators.es6')

const getStateFromStore = (props) => {
  return {
    task: TaskStore.get(props.id)
  }
}

const TaskListItem = React.createClass({
  mixins: [PureRenderMixin]

  , getInitialState() {
    return getStateFromStore(this.props)
  }

  , componentDidMount() {
    TaskStore.addChangeListener(this._onChange)
  }

  , componentWillUnmount() {
    TaskStore.removeChangeListener(this._onChange)
  }

  , render() {
    if(this.state.task) {
      return (
        <li className="task-item">
          <MUI.Checkbox 
            checked={this.state.task.completed}
            defaultSwitched={this.state.task.completed}
            onCheck={this.onCheck}
          />
          <SyncField id={ this.state.task.id + '_task_title' }></SyncField>
        </li>
      )      
    } else {
      return (
        <div>Loading...</div>
      )
    }
  }

  , onCheck(e, isChecked) {
    TaskActionCreators.setTaskCompletion(this.state.task, isChecked)
  }

  , _onChange() {
    this.setState(getStateFromStore(this.props))
  }
})

module.exports = TaskListItem
