const React = require('react')
const MeetingClientActions = require('../actions/MeetingClientActionCreators.es6')
const PureRenderMixin = require('react/addons').addons.PureRenderMixin

const CreateMeetingButton = React.createClass({
  mixins: [PureRenderMixin]
  
  , createMeeting() {
    MeetingClientActions.createNewMeeting()
  }
  , render() {
    return (
      <button onClick={this.createMeeting}>New Meeting</button>
    )
  }
})

module.exports = CreateMeetingButton
