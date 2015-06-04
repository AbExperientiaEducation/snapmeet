const React = require('react')
const MeetingClientActionCreators = require('../actions/MeetingClientActionCreators.es6')
const NewMeeting = React.createClass({
  componentWillMount() {
    setTimeout(MeetingClientActionCreators.createNewMeeting, 0)
  }

  , render() {
    return <div>Loading...</div>
  }
})

module.exports = NewMeeting
