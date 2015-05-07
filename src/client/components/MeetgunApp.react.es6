const SignInSoon = require('./SignInSoon.react.es6')
const React = require('react')
const PureRenderMixin = require('react/addons').addons.PureRenderMixin
const Router = require('react-router')
const RouteHandler = Router.RouteHandler
const Link = Router.Link
const ServerResourceActionCreators = require('../actions/ServerResourceActionCreators.es6')
const GlobalUIStore = require('../stores/GlobalUIStore.es6')
const ConnectedStates = require('../constants/SocketConstants.es6').ConnectedStates

const getStateFromStore = () => {
  const globalState = GlobalUIStore.globalUIState()
  return {
    connectStatus: globalState.connectStatus
  }
}

const MeetgunApp = React.createClass({
  mixins: [PureRenderMixin]

  , getInitialState() {
    return getStateFromStore()
  }

  , componentDidMount() {
    GlobalUIStore.addChangeListener(this._onChange)
  }

  , componentWillUnmount() {
    GlobalUIStore.removeChangeListener(this._onChange)
  }

  , componentWillMount() {
    // Kick off bootstrapped data
    ServerResourceActionCreators.receiveBootstrapData()
  }

  , _onChange() {
    this.setState(getStateFromStore(this.props))
  }

  , render() {
    switch(this.state.connectStatus) {
      case ConnectedStates.CONNECTING:
        return <div>Connecting to realtime server...</div>
      case ConnectedStates.RECONNECTING:
        return <div>Disconnected from realtime server. Reconnecting...</div>
      case ConnectedStates.CONNECTED:
        return (
          <div className="meetingapp">
            <div className="topbar">
              <h1><Link to="app"><span className="logo-start">Meet</span><span className="logo-end">gun</span></Link></h1>
              <SignInSoon />
            </div>
            <div className="main-content">
              
              <RouteHandler {...this.props}/>
            </div>
          </div>
       )   
    }
  }
})

module.exports = MeetgunApp
