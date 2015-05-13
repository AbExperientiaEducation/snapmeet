const React = require('react')
const ReactPropTypes = React.PropTypes
const PureRenderMixin = require('react/addons').addons.PureRenderMixin
const AudioIndicator = require('./AudioIndicator.react.es6')

const SelfVideo = React.createClass({
  mixins: [PureRenderMixin]
  , propTypes: {
    video: ReactPropTypes.object
    , volume: ReactPropTypes.number
  }

  , render() {
    const src = this.props.video && this.props.video.src
    if(!src) return <div className="video-container"></div>
    return <div className="video-container">
      <video 
        src={src} 
        autoPlay
        muted={true}
      />
      <AudioIndicator volume={this.props.volume}/>
    </div>
  }
})

module.exports = SelfVideo
