const React = require('react')
const ReactPropTypes = React.PropTypes
const PureRenderMixin = require('react/addons').addons.PureRenderMixin

const PeerVideo = React.createClass({
  mixins: [PureRenderMixin]
  , propTypes: {
    video: ReactPropTypes.object
    , connectionState: ReactPropTypes.string
  }

  , render() {
    return <div className="video-container">
      <video src={this.props.video.src} autoPlay />
      <div className="connection-state">{this.getConnectionText()}</div>
    </div>
  }

  , getConnectionText() {
    switch (this.props.connectionState) {
      case 'checking':
        return 'Connecting to video...'
      case 'connected':
      case 'completed': // on caller side
        return 'Connection established.'
      case 'disconnected':
        return 'Disconnected.'
      case 'failed':
        return "Connection failed"
      case 'closed':
        return 'Connection closed.'
    }
  }


})

module.exports = PeerVideo