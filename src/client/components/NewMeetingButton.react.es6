const React = require('react')
const MeetingClientActions = require('../actions/MeetingClientActionCreators.es6')
const PureRenderMixin = require('react/addons').addons.PureRenderMixin

const MeetingListItem = React.createClass({
  mixins: [PureRenderMixin]
  
  , createMeeting: function() {
    MeetingClientActions.createNewMeeting()
  }
  , render: function() {
    return (
      <button onClick={this.createMeeting}>New Meeting</button>
    )
  }
})

module.exports = MeetingListItem