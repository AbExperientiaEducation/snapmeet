const SignInForm = require('./SignInForm.react.es6')
const React = require('react')
const PureRenderMixin = require('react/addons').addons.PureRenderMixin
const Router = require('react-router')
const RouteHandler = Router.RouteHandler
const Link = Router.Link
const OrgStore = require('../stores/OrgStore.es6')

const getStateFromStore = () => {
  return {
    org: OrgStore.get("*TEST*")
  }
}

const MeetgunApp = React.createClass({
  mixins: [PureRenderMixin]

  , getInitialState() {
    return getStateFromStore()
  }

  , _onChange() {
    this.setState(getStateFromStore(this.props))
  }

  , componentDidMount() {
    OrgStore.addChangeListener(this._onChange)
  }

  , componentWillUnmount() {
    OrgStore.removeChangeListener(this._onChange)
  }

  , render() {
    if(this.state.org) {
      return (
        <div className="meetingapp">
          <Link to="app"><img src="/img/logo.jpg"/></Link>
          <div className="main-content">
            <h2>{this.state.org.displayName}</h2>
            <SignInForm />
            <RouteHandler {...this.props}/>
          </div>
        </div>
      )      
    } else {
      return (<div>Loading...</div>)
    }
  }
})

module.exports = MeetgunApp
