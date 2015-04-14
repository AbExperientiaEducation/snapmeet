const MeetingSection = require('./MeetingSection.react.es6')
const SyncBox = require('./SyncBox.react.es6')
const React = require('react')
const PureRenderMixin = require('react/addons').addons.PureRenderMixin

const MeetgunApp = React.createClass({
  mixins: [PureRenderMixin]
  , render: () => {
    return (
      <div className="meetingapp">
        <SyncBox /> 
        <MeetingSection />
      </div>
    )
  }

})

module.exports = MeetgunApp
