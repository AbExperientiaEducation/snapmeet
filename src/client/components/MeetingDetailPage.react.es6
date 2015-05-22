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

const getStateFromStore = (props) => {
  return {
    meeting: MeetingStore.get(props.params.id)
  }
}

const MeetingDetailPage = React.createClass({
  mixins: [PureRenderMixin]

  , getInitialState() {
    return getStateFromStore(this.props)
  }

  , componentDidMount() {
    MeetingStore.addChangeListener(this._onChange)
    const userMeetingIds = CurrentUserHelpers.userMeetingIds()
    // userMeetingIds is null if we don't have a current user loaded.
    // Typically from dropping the db.
    if(userMeetingIds && userMeetingIds.indexOf(this.props.params.id) === -1) {
      setTimeout(()=>{MeetingClientActionCreators.addCurrentUserToMeeting(this.props.params.id)}, 0)    
    }
  }

  , componentWillUnmount() {
    MeetingStore.removeChangeListener(this._onChange)
  }

  , render() {
    if(this.state.meeting) {
      const meetingId = this.state.meeting.id
      return (
        <div className="meeting-detail">
          <h2 className="no-underline meeting-title"><SyncField 
            id={ meetingId + '_meeting_title' } 
            placeholder="Untitled Meeting"
            autoResize={true}
          /><ShareWidget /></h2>
          <Link className="all-meetings" to="app">{'< All Meetings'}</Link>
          <VCBox 
            meetingId={ meetingId }
          />
          <div className="meeting-components">
            <div className="notes-card card" zDepth={1}>
              <h3>Notes</h3>
              <SyncBox id={ meetingId + '_notes'} /> 
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
