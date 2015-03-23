const MeetgunApp = require('./components/MeetgunApp.react.es6')
const ExampleData = require('./ExampleData.es6')
const MeetingWebAPIUtils = require('./utils/MeetingWebAPIUtils.es6')
const React = require('react')
ExampleData.init()

MeetingWebAPIUtils.getAllMeetings()

React.render(
    <MeetgunApp />,
    document.getElementById('content')
)
