const React = require('react')
const MeetingClientActions = require('../actions/MeetingClientActionCreators.es6')
const PureRenderMixin = require('react/addons').addons.PureRenderMixin
const MUI = require('material-ui')
const Analytics = require('../utils/Analytics.es6')

const CreateMeetingButton = React.createClass({
  mixins: [PureRenderMixin]
  
  , createMeeting() {
    MeetingClientActions.createNewMeeting()
    Analytics.track('Create Meeting')
  }
  , render() {
    return (
      <MUI.RaisedButton 
        onClick={this.createMeeting}
        primary={true}
        label="Create New Meeting"
      />
    )
  }
})

module.exports = CreateMeetingButton
