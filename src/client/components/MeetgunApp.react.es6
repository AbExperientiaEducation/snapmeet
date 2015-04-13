const MeetingSection = require('./MeetingSection.react.es6')
const SignInForm = require('./SignInForm.react.es6')
const React = require('react')
const PureRenderMixin = require('react/addons').addons.PureRenderMixin

const MeetgunApp = React.createClass({
  mixins: [PureRenderMixin]
  , render: () => {
    return (
      <div className="meetingapp">
        <SignInForm />
        <MeetingSection />
      </div>
    )
  }

})

module.exports = MeetgunApp
