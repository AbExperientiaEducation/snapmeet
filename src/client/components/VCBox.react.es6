const React = require('react')
const ReactPropTypes = React.PropTypes
const PureRenderMixin = require('react/addons').addons.PureRenderMixin
const VCRoomStore = require('../stores/VCRoomStore.es6')
// const SimpleWebRTC = require('simplewebrtc')

const getStateFromStore = (props) => {
  const relatedRoomArray = VCRoomStore.getResourcesFromRelation(props.meetingId, 'MEETING_VCROOM')
  return {
    vcRoom: relatedRoomArray ? relatedRoomArray.first() : null
  }
}

const VCBox = React.createClass({
  propTypes: {
    meetingId: ReactPropTypes.string
  }

  , getInitialState() {
    return getStateFromStore(this.props)
  }

  , componentDidMount() {
    VCRoomStore.addChangeListener(this._onChange)
  }

  , componentWillUnmount() {
    VCRoomStore.removeChangeListener(this._onChange)
  }

  , _onChange() {
    this.setState(getStateFromStore(this.props))
  }

  , shouldComponentUpdate() { 
    return !this.state.webRtcComponent
  }

  , render() {
    const rtcSupport = !!window.webkitRTCPeerConnection || !!window.mozRTCPeerConnection
    if(!rtcSupport) {
      return <div>
        <h4>Videoconferencing not available for your browser</h4>
        <p>Please use <a href="https://www.mozilla.org/en-US/firefox/new">Mozilla Firefox</a> or <a href="https://www.google.com/chrome/">Google Chrome</a> to use the video conference feature</p>
      </div>
    }
    if(!this.state.vcRoom) {
      return <div><button disabled>Loading Videochat</button></div>
    } else if (!this.state.startVC) {
      return <div><button onClick={this.onClick}>Join video chat</button></div>
    } else {
      return <div>
        <div ref="others"></div>
        <div ref="you"></div>
      </div>      
    }
  }

  , onClick() {
    this.setState({startVC: true}, this.setupWebRtcIfNecessary)
  }

  , setupWebRtcIfNecessary() {
    if(this.state.webRtcComponent || !this.state.startVC) return
    // Create our WebRTC connection
    const webrtc = new SimpleWebRTC({
      // The DOM element that will hold "our" video
      localVideoEl: React.findDOMNode(this.refs.you)
      // The DOM element that will hold remote videos
      , remoteVideosEl: React.findDOMNode(this.refs.others)
      // Immediately ask for camera access
      , autoRequestMedia: true
      , debug: false
      , detectSpeakingEvents: true
      , autoAdjustMic: false
      , peerConnectionConfig: this.state.vcRoom.credentials
      // We're still using simplewebrtc signaling server. Should switch to XirSys
      , url: 'https://signaling.simplewebrtc.com:443'
      // , url: 'wss://api.xirsys.com:443'
    })
    webrtc.on('readyToCall', () => {
      // you can name it anything
      webrtc.joinRoom(this.state.vcRoom.id);
    })
    this.setState({webRtcComponent: webrtc})
  }
})

module.exports = VCBox