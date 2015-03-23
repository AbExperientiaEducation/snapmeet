const React = require('react')
const ReactPropTypes = React.PropTypes

const MeetingListItem = React.createClass({

  propTypes: {
    meeting: ReactPropTypes.object
  }

  , render: () => {
    var meeting = this.props.meeting
    return (
      <li className="meeting-list-item">
        <div className="meeting-id">{meeting.id}</div>
        <div className="meeting-time">
          {meeting.date.toLocaleTimeString()}
        </div>
      </li>
    )
  }
})

module.exports = MeetingListItem