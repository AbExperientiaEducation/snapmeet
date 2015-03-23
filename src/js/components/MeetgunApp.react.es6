const MeetingSection = require('./MeetingSection.react.es6')
const React = require('react')

const MeetgunApp = React.createClass({

  render: () => {
    return (
      <div className="meetingapp">
        <MeetingSection />
      </div>
    )
  }

})

module.exports = MeetgunApp
