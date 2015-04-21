const React = require('react')
const ReactPropTypes = React.PropTypes
const Link = require('react-router').Link
const PureRenderMixin = require('react/addons').addons.PureRenderMixin

const MeetingListItem = React.createClass({
  mixins: [PureRenderMixin]
  , propTypes: {
    meeting: ReactPropTypes.object
  }

  , render() {
    const meeting = this.props.meeting
    return (
      <li className="meeting-list-item">
        <div className="meeting-id"><Link to="meeting" params={ {id: meeting.id} }>{meeting.id}</Link></div>
        <div className="meeting-id">{meeting.name}</div>
        <div className="meeting-time">
          {new Date(meeting.timestamp).toLocaleTimeString()}
        </div>
      </li>
    )
  }
})

module.exports = MeetingListItem