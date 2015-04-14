const React = require('react')
const ReactPropTypes = React.PropTypes
const PureRenderMixin = require('react/addons').addons.PureRenderMixin

const MeetingListItem = React.createClass({
  mixins: [PureRenderMixin]
  , propTypes: {
    meeting: ReactPropTypes.object
  }

  , render: function() {
    const meeting = this.props.meeting
    return (
      <li className="meeting-list-item">
        <div className="meeting-id">{meeting.id}</div>
        <div className="meeting-id">{meeting.name}</div>
        <div className="meeting-time">
          {meeting.date.toLocaleTimeString()}
        </div>
      </li>
    )
  }
})

module.exports = MeetingListItem