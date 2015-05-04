const MeetingStore = require('../stores/MeetingStore.es6')
const UserStore = require('../stores/UserStore.es6')
const RelationStore = require('../stores/RelationStore.es6')
const MeetingListItem = require('./MeetingListItem.react.es6')
const NewMeetingButton = require('./NewMeetingButton.react.es6')
const _ = require('lodash')
const React = require('react')
const PureRenderMixin = require('react/addons').addons.PureRenderMixin
const CurrentUserHelpers = require('../utils/CurrentUserHelpers.es6')

const getStateFromStore = () => {
  return {
    meetings: CurrentUserHelpers.userMeetings()
  }
}

const getMeetingListItem = (meeting) => {
  return (
    <MeetingListItem
      key={meeting.id}
      meeting={meeting}
    />
  )
}

const MeetingSection = React.createClass({
  mixins: [PureRenderMixin]

  , getInitialState() {
    return getStateFromStore()
  }

  , componentDidMount() {
    MeetingStore.addChangeListener(this._onChange)
    RelationStore.addChangeListener(this._onChange)
    UserStore.addChangeListener(this._onChange)
  }

  , componentWillUnmount() {
    MeetingStore.removeChangeListener(this._onChange)
    RelationStore.removeChangeListener(this._onChange)
    UserStore.removeChangeListener(this._onChange)
  }

  , render() {
    if(this.state.meetings) {
      const meetingListItems = this.state.meetings.map(getMeetingListItem)
      return (
        <div className="meeting-section">
          <h3>Meetings <NewMeetingButton /></h3>
          <ul className="meeting-list" ref="meetingList">
            {meetingListItems}
          </ul>
        </div>
      )
    } else {
      return(<NewMeetingButton />)
    }
  }

  /**
   * Event handler for 'change' events coming from the MessageStore
   */
  , _onChange() {
    this.setState(getStateFromStore())
  }
})

module.exports = MeetingSection
