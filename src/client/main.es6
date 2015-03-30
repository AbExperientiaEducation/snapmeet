const MeetgunApp = require('./components/MeetgunApp.react.es6')
const MeetingWebAPIUtils = require('./utils/MeetingWebAPIUtils.es6')
const React = require('react')

MeetingWebAPIUtils.getAllMeetings()

React.render(
    <MeetgunApp />,
    document.getElementById('content')
)
