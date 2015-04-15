const MeetingStore = require('../stores/MeetingStore.es6')
const MeetingListItem = require('./MeetingListItem.react.es6')
const NewMeetingButton = require('./NewMeetingButton.react.es6')
const _ = require('lodash')
const React = require('react')
const PureRenderMixin = require('react/addons').addons.PureRenderMixin

const getStateFromStore = () => {
  return {
    meetings: MeetingStore.getAll().reverse()
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
    this._scrollToBottom()
    MeetingStore.addChangeListener(this._onChange)
  }

  , componentWillUnmount() {
    MeetingStore.removeChangeListener(this._onChange)
  }

  , render() {
    const meetingListItems = this.state.meetings.map(getMeetingListItem)
    return (
      <div className="meeting-section">
        <NewMeetingButton />
        <ul className="meeting-list" ref="meetingList">
          {meetingListItems}
        </ul>
      </div>
    )
  }

  , componentDidUpdate() {
    this._scrollToBottom()
  }

  , _scrollToBottom() {
    const ul = this.refs.meetingList.getDOMNode()
    ul.scrollTop = ul.scrollHeight
  }

  /**
   * Event handler for 'change' events coming from the MessageStore
   */
  , _onChange() {
    this.setState(getStateFromStore())
  }
})

module.exports = MeetingSection
