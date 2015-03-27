const MeetingStore = require('../stores/MeetingStore.es6')
const MeetingListItem = require('./MeetingListItem.react.es6')
const _ = require('lodash')
const React = require('react')

const getStateFromStore = () => {
  return {
    meetings: _.values(MeetingStore.getAll())
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

  getInitialState: function() {
    return getStateFromStore()
  }

  , componentDidMount: function() {
    this._scrollToBottom()
    MeetingStore.addChangeListener(this._onChange)
  }

  , componentWillUnmount: function() {
    MeetingStore.removeChangeListener(this._onChange)
  }

  , render: function() {
    const meetingListItems = this.state.meetings.map(getMeetingListItem)
    return (
      <div className="meeting-section">
        <ul className="meeting-list" ref="meetingList">
          {meetingListItems}
        </ul>
      </div>
    )
  }

  , componentDidUpdate: function() {
    this._scrollToBottom()
  }

  , _scrollToBottom: function() {
    const ul = this.refs.meetingList.getDOMNode()
    ul.scrollTop = ul.scrollHeight
  }

  /**
   * Event handler for 'change' events coming from the MessageStore
   */
  , _onChange: function() {
    this.setState(getStateFromStore())
  }
})

module.exports = MeetingSection
