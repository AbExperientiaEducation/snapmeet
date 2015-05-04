const SignInForm = require('./SignInForm.react.es6')
const React = require('react')
const PureRenderMixin = require('react/addons').addons.PureRenderMixin
const Router = require('react-router')
const RouteHandler = Router.RouteHandler
const Link = Router.Link
const ServerResourceActionCreators = require('../actions/ServerResourceActionCreators.es6')

const MeetgunApp = React.createClass({
  mixins: [PureRenderMixin]

  , componentWillMount() {
    // Kick off bootstrapped data
    ServerResourceActionCreators.receiveBootstrapData()
  }

  , componentWillUnmount() {
  }

  , render() {
      return (
        <div className="meetingapp">
          <div className="topbar">
            <h1><Link to="app"><span className="logo-start">Meet</span><span className="logo-end">gun</span></Link></h1>
            <SignInForm />
          </div>
          <div className="main-content">
            
            <RouteHandler {...this.props}/>
          </div>
        </div>
      )   
  }
})

module.exports = MeetgunApp
