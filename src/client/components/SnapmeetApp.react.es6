const ProComingSoon = require('./ProComingSoon.react.es6')
const ContactUs = require('./ContactUs.react.es6')
const React = require('react/addons')
const PureRenderMixin = require('react/addons').addons.PureRenderMixin
const Router = require('react-router')
const RouteHandler = Router.RouteHandler
const Link = Router.Link
const ServerResourceActionCreators = require('../actions/ServerResourceActionCreators.es6')
const GlobalUIStore = require('../stores/GlobalUIStore.es6')
const ConnectedStates = require('../constants/SocketConstants.es6').ConnectedStates
const OverlaySpinner = require('./OverlaySpinner.react.es6')
const ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

const getStateFromStore = () => {
  const globalState = GlobalUIStore.globalUIState()
  return {
    connectStatus: globalState.connectStatus
  }
}

const SnapmeetApp = React.createClass({
  mixins: [PureRenderMixin]

  , contextTypes: {
    router: React.PropTypes.func.isRequired
  }

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
        return <OverlaySpinner label="Loading Snapmeet"/>
      case ConnectedStates.RECONNECTING:
        return <OverlaySpinner label="Can't reach server. Reconnecting."/>
      case ConnectedStates.CONNECTED:
        var name = this.context.router.getCurrentPath();
        return (
          <div className="meetingapp">
            <div className="topbar">
              <h1><Link to="app"><span className="logo-start">Snap</span><span className="logo-end">meet</span></Link></h1>
              <div className="right-content">
                <ContactUs />
                <ProComingSoon />
              </div>
            </div>
            <div className="main-content">
              <ReactCSSTransitionGroup component="div" transitionName="pop" transitionLeave={false}>
                <RouteHandler key={name} {...this.props}/>
              </ReactCSSTransitionGroup>
            </div>
          </div>
       )   
    }
  }
})

module.exports = SnapmeetApp
