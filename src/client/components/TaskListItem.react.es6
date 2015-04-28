const React = require('react')
const PureRenderMixin = require('react/addons').addons.PureRenderMixin
const TaskStore = require('../stores/TaskStore.es6')
const SyncField = require('./SyncField.react.es6')
const MUI = require('material-ui')

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
          <MUI.Checkbox />
          <SyncField id={ this.state.task.id + '_task_title' }/>
        </li>
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

module.exports = TaskListItem
