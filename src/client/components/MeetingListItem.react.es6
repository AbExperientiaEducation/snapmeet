const React = require('react')
const ReactPropTypes = React.PropTypes
const Link = require('react-router').Link
const PureRenderMixin = require('react/addons').addons.PureRenderMixin
const SyncOutput = require('./SyncOutput.react.es6')
const MeetingListItem = React.createClass({
  mixins: [PureRenderMixin]
  , propTypes: {
    meeting: ReactPropTypes.object
  }

  , render() {
    const meeting = this.props.meeting
    const titleId = meeting.id + '_meeting_title'
    return (
      <li className="meeting-list-item">
        <div className="meeting-id">
          <Link to="meeting" params={ {id: meeting.id} }>
            <SyncOutput
              id={titleId}
            />
          </Link>
        </div>
        <div className="meeting-id">{meeting.name}</div>
        <div className="meeting-time">
          {new Date(meeting.createdTimestamp).toLocaleTimeString()}
        </div>
      </li>
    )
  }
})

module.exports = MeetingListItem