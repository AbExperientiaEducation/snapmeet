const React = require('react')
const MeetingWebAPIUtils = require('../utils/MeetingWebAPIUtils.es6')

const MeetingListItem = React.createClass({
  createMeeting: function() {
    MeetingWebAPIUtils.saveNewMeeting()
  }
  , render: function() {
    return (
      <button onClick={this.createMeeting}>New Meeting</button>
    )
  }
})

module.exports = MeetingListItem