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
          <div className="topbar">
            <h1><Link to="app"><span className="logo-start">Meet</span><span className="logo-end">gun</span></Link></h1>
            <h2>{this.state.org.displayName}</h2>
            <SignInForm />
          </div>
          <div className="main-content">
            
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
