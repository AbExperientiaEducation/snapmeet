const MeetingSection = require('./MeetingSection.react.es6')
const SyncBox = require('./SyncBox.react.es6')
const SignInForm = require('./SignInForm.react.es6')
const React = require('react')
const PureRenderMixin = require('react/addons').addons.PureRenderMixin
const Router = require('react-router')
const RouteHandler = Router.RouteHandler
const Link = Router.Link

const MeetingWebAPIUtils = require('../utils/MeetingWebAPIUtils.es6')
MeetingWebAPIUtils.getAll()

const MeetgunApp = React.createClass({
  mixins: [PureRenderMixin]
  , render() {
    return (
      <div className="meetingapp">
        <Link to="app"><img src="/img/logo.jpg"/></Link>
        <SignInForm />
        <RouteHandler {...this.props}/>
      </div>
    )
  }
})

module.exports = MeetgunApp
