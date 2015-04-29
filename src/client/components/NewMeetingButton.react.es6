const React = require('react')
const MeetingClientActions = require('../actions/MeetingClientActionCreators.es6')
const PureRenderMixin = require('react/addons').addons.PureRenderMixin
const MUI = require('material-ui')

const CreateMeetingButton = React.createClass({
  mixins: [PureRenderMixin]
  
  , createMeeting() {
    MeetingClientActions.createNewMeeting()
  }
  , render() {
    return (
      <MUI.RaisedButton 
        onClick={this.createMeeting}
        primary={true}
        label="Create New"
      />
    )
  }
})

module.exports = CreateMeetingButton
