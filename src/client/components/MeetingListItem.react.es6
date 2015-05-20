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
    const localeOptions = { weekday: 'long', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    const meeting = this.props.meeting
    const titleId = meeting.id + '_meeting_title'
    return (
      <li className="meeting-list-item">
        <Link to="meeting" params={ {id: meeting.id} }>
          <div className="meeting-id">
            <SyncOutput
              className="meeting-title"
              id={titleId}
            />
          </div>

          <div className="meeting-id">{meeting.name}</div>
          <div className="meeting-time">
            {new Date(meeting.createdTimestamp).toLocaleDateString('en-us', localeOptions)}
          </div>
        </Link>
      </li>
    )
  }
})

module.exports = MeetingListItem