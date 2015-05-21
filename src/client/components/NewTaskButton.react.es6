const React = require('react')
const ReactPropTypes = React.PropTypes
const TaskClientActions = require('../actions/TaskClientActionCreators.es6')
const PureRenderMixin = require('react/addons').addons.PureRenderMixin
const TaskStore = require('../stores/TaskStore.es6')
const MUI = require('material-ui')
const Analytics = require('../utils/Analytics.es6')

const CreateTaskButton = React.createClass({
  mixins: [PureRenderMixin]
  , propTypes: {
    meetingId: ReactPropTypes.string
  }
  
  , createTask() {
    TaskClientActions.createNewTask(this.props.meetingId)
    Analytics.track('Create Task')
  }
  , render() {
    return (
      <MUI.RaisedButton 
        onClick={this.createTask}
        primary={true}
        label="Create"
      />
    )
  }
})

module.exports = CreateTaskButton
