const React = require('react')
const PureRenderMixin = require('react/addons').addons.PureRenderMixin
const MeetingStore = require('../stores/MeetingStore.es6')
const SyncBox = require('./SyncBox.react.es6')
const NewTaskButton = require('./NewTaskButton.react.es6')
const MeetingTaskList = require('./MeetingTaskList.react.es6')
const MUI = require('material-ui')
const MeetingClientActionCreators = require('../actions/MeetingClientActionCreators.es6')
const CurrentUserHelpers = require('../utils/CurrentUserHelpers.es6')
const SyncField = require('./SyncField.react.es6')

const getStateFromStore = (props) => {
  return {
    meeting: MeetingStore.get(props.params.id)
  }
}

const MeetingDetailPage = React.createClass({
  mixins: [PureRenderMixin]

  , getInitialState() {
    const state = getStateFromStore(this.props)
    const userMeetingIds = CurrentUserHelpers.userMeetingIds()
    if(userMeetingIds.indexOf(this.props.params.id) === -1) {
      MeetingClientActionCreators.addCurrentUserToMeeting(this.props.params.id)
    }

    return state
  }

  , componentDidMount() {
    MeetingStore.addChangeListener(this._onChange)
  }

  , componentWillUnmount() {
    MeetingStore.removeChangeListener(this._onChange)
  }

  , render() {
    if(this.state.meeting) {
      const meetingId = this.state.meeting.id
      return (
        <div className="meeting-detail">
          <h2 className="no-underline"><SyncField 
            id={ meetingId + '_meeting_title' } 
            placeholder="Untitled Meeting"
          /></h2>
          <div className="meeting-components">
            <MUI.Paper className="tasks-card card" zDepth={1}>
              <h3>Tasks <NewTaskButton meetingId={ meetingId }/></h3>
              <MeetingTaskList meetingId={ meetingId } />
            </MUI.Paper>
            <MUI.Paper className="notes-card card" zDepth={1}>
              <h3>Notes</h3>
              <SyncBox id={ meetingId + '_notes'} /> 
            </MUI.Paper>
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
