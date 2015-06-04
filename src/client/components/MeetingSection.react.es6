const MeetingStore = require('../stores/MeetingStore.es6')
const UserStore = require('../stores/UserStore.es6')
const RelationStore = require('../stores/RelationStore.es6')
const MeetingListItem = require('./MeetingListItem.react.es6')
const NewMeetingButton = require('./NewMeetingButton.react.es6')
const _ = require('lodash')
const React = require('react')
const PureRenderMixin = require('react/addons').addons.PureRenderMixin
const CurrentUserHelpers = require('../utils/CurrentUserHelpers.es6')
const ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

const getStateFromStore = () => {
  const meetings = CurrentUserHelpers.userMeetings()
  const sortedMeetings = meetings ? meetings.sortBy(m => {return m.createdTimestamp}) : null
  return {
    meetings: sortedMeetings
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
      const meetingListItems = this.state.meetings.map(getMeetingListItem).toArray()
      const empty = meetingListItems.length === 0
      return (
        <div className="meeting-section">          
          { empty ? 
            <div className='about'>
              <div className="content">
                <div className="header">
                  <h1>Remote Meetings in a Snap</h1>
                  <p>
                    Everything you need to have remote meetings, and nothing else. No accounts or downloads required.
                  </p>
                  <NewMeetingButton />
                </div>
                <hr />
                <div className="features Grid Grid--gutters Grid--full large-Grid--fit">
                  <div className="Grid-cell">
                    <div className="feature">
                      <h3>Video Chat</h3>
                      <p>
                        Chat with your colleagues
                      </p>
                      <img src="img/about/video.png" alt="" />
                    </div>
                  </div>
                  <div className="Grid-cell">
                    <div className="feature">
                      <h3>Collaborative Notes</h3>
                      <p>
                        Take notes as a team
                      </p>
                      <img src="img/about/notes.png" alt="" />
                    </div>
                  </div>
                  <div className="Grid-cell">
                    <div className="feature">
                      <h3>Tasks</h3>
                      <p>
                        Create tasks easily &amp; quickly
                      </p>
                      <img src="img/about/tasks.png" alt="" />
                    </div>
                  </div>
                </div>
              </div>
          </div>
            : <h2>Meetings <NewMeetingButton /></h2> }

          <ul className="meeting-list" ref="meetingList">
          <ReactCSSTransitionGroup transitionName="slide">
            {meetingListItems}
          </ReactCSSTransitionGroup>
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
