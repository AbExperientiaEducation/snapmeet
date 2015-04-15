const MeetingSection = require('./MeetingSection.react.es6')
const SyncBox = require('./SyncBox.react.es6')
const SignInForm = require('./SignInForm.react.es6')
const React = require('react')
const PureRenderMixin = require('react/addons').addons.PureRenderMixin
const RouteHandler = require('react-router').RouteHandler

const MeetingWebAPIUtils = require('../utils/MeetingWebAPIUtils.es6')
MeetingWebAPIUtils.getAllMeetings()

const MeetgunApp = React.createClass({
  mixins: [PureRenderMixin]
  , render: () => {
    return (
      <div className="meetingapp">
        <RouteHandler />
        <SignInForm />
        <SyncBox /> 
        <MeetingSection />
      </div>
    )
  }
})

module.exports = MeetgunApp
