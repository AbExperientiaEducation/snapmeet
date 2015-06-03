const React = require('react')
const PureRenderMixin = require('react/addons').addons.PureRenderMixin
const MeetingStore = require('../stores/MeetingStore.es6')
const SyncBox = require('./SyncBox.react.es6')
const VCBox = require('./VCBox.react.es6')
const NewTaskButton = require('./NewTaskButton.react.es6')
const MeetingTaskList = require('./MeetingTaskList.react.es6')
const MUI = require('material-ui')
const MeetingClientActionCreators = require('../actions/MeetingClientActionCreators.es6')
const CurrentUserHelpers = require('../utils/CurrentUserHelpers.es6')
const SyncField = require('./SyncField.react.es6')
const ShareWidget = require('./ShareWidget.react.es6')
const Link = require('react-router').Link
const MeetingConstants = require('../../shared/constants/ResourceConstants.es6').Meeting
const SocketEventConstants = require('../../shared/constants/SocketEventConstants.es6')
const GlobalUIStore = require('../stores/GlobalUIStore.es6')
const PresenceStore = require('../stores/PresenceStore.es6')

const getStateFromStore = (props) => {
  return {
    meeting: MeetingStore.get(props.params.id)
    , presentUsers: PresenceStore.getPresentUsers('MEETING' + props.params.id)
  }
}

const MeetingDetailPage = React.createClass({
  mixins: [PureRenderMixin]

  , getInitialState() {
    return getStateFromStore(this.props)
  }

  , statics: {
    willTransitionFrom(transition, component) {
      if(GlobalUIStore.globalUIState().vcOpen) {
        const doClose = window.confirm("Leaving this page will close video chat. Continue?")
        if(!doClose) transition.abort()
      }
    }
  }

  , componentDidMount() {
    PresenceStore.addChangeListener(this._onChange)
    MeetingStore.addChangeListener(this._onChange)
    const userMeetingIds = CurrentUserHelpers.userMeetingIds()
    // userMeetingIds is null if we don't have a current user loaded.
    // Typically from dropping the db.
    if(userMeetingIds && userMeetingIds.indexOf(this.props.params.id) === -1) {
      setTimeout(()=>{MeetingClientActionCreators.addCurrentUserToMeeting(this.props.params.id)}, 0)    
    }
    setTimeout(() => {MeetingClientActionCreators.joinPresence(this.props.params.id, MeetingConstants.LABEL)}, 0)
  }

  , componentWillUnmount() {
    setTimeout(() => {MeetingClientActionCreators.leavePresence(this.props.params.id, MeetingConstants.LABEL)}, 0)
    MeetingStore.removeChangeListener(this._onChange)
    PresenceStore.removeChangeListener(this._onChange)
  }

  , render() {
    if(this.state.meeting) {
      const meetingId = this.state.meeting.id
      const presentCount = this.state.presentUsers && this.state.presentUsers.length
      return (
        <div className="meeting-detail">
          <h2 className="no-underline meeting-title"><SyncField 
            id={ meetingId + SocketEventConstants.MEETING_TITLE_SUFFIX } 
            placeholder="Untitled Meeting"
            autoResize={true}
          /><ShareWidget />
          </h2>
          <div className="presence">{presentCount} {presentCount > 1 ? 'people' : 'person'} in this meeting</div>
          <Link className="all-meetings" to="app">{'< All Meetings'}</Link>
          <VCBox 
            meetingId={ meetingId }
          />
          <div className="meeting-components">
            <div className="notes-card card" zDepth={1}>
              <h3>Notes</h3>
              <SyncBox id={ meetingId + SocketEventConstants.MEETING_NOTES_SUFFIX} /> 
            </div>
            <div className="tasks-card card" zDepth={1}>
              <h3>Tasks <NewTaskButton meetingId={ meetingId }/></h3>
              <MeetingTaskList meetingId={ meetingId } />
            </div>
          </div>
        </div>
      )      
    } else {
      return (
        <div>Loading...</div>
      )
    }
  }

  , _onChange() {
    this.setState(getStateFromStore(this.props))
  }
})

module.exports = MeetingDetailPage
