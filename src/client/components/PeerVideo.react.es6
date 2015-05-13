const React = require('react')
const ReactPropTypes = React.PropTypes
const PureRenderMixin = require('react/addons').addons.PureRenderMixin
const AudioIndicator = require('./AudioIndicator.react.es6')

const PeerVideo = React.createClass({
  mixins: [PureRenderMixin]
  , propTypes: {
    video: ReactPropTypes.object
    , connectionState: ReactPropTypes.string
    , volume: ReactPropTypes.number
  }

  , render() {
    const src = this.props.video && this.props.video.src
    if(!src) return <div className="video-container"></div>
    return <div className="video-container">
      <video 
        src={src} 
        autoPlay 
      />
      <div className="connection-state">{this.getConnectionText()}</div>
      <AudioIndicator volume={this.props.volume}/>
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