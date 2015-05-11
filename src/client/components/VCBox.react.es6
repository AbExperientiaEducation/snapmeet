const React = require('react')
const ReactPropTypes = React.PropTypes
const PureRenderMixin = require('react/addons').addons.PureRenderMixin
const VCRoomStore = require('../stores/VCRoomStore.es6')
const _ = require('lodash')
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

  , makeVideoComponent(video) {
    return <video src={video.src} autoPlay />
  }

  , componentDidMount() {
    VCRoomStore.addChangeListener(this._onChange)
  }

  , componentWillUnmount() {
    if(this.state.webRtcComponent) {
      this.state.webRtcComponent.stopLocalVideo()
      this.state.webRtcComponent.leaveRoom()
      this.state.webRtcComponent.disconnect()  
    }
    VCRoomStore.removeChangeListener(this._onChange)
  }

  , _onChange() {
    this.setState(getStateFromStore(this.props))
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
      const videos = this.state.videos && this.state.videos.map(v => {return this.makeVideoComponent(v)})
      return <div>
        <div className="others-video" ref="others">
          {videos}
        </div>
        <div className="you-video" ref="you"></div>
      </div>      
    }
  }

  , onClick() {
    this.setState({startVC: true}, this.setupWebRtcIfNecessary)
  }

  , setupWebRtcIfNecessary() {
    if(this.state.webRtcComponent || !this.state.startVC) return
    this.setState({videos: []})
    // Create our WebRTC connection
    const webrtc = new SimpleWebRTC({
      // The DOM element that will hold "our" video
      localVideoEl: React.findDOMNode(this.refs.you)
      // The DOM element that will hold remote videos
      , remoteVideosEl: ''
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

    webrtc.on('videoAdded', (video, peer) => {
      video.oncontextmenu = function () { return false }
      this.setState({videos: this.state.videos.concat([video])})
    })

    webrtc.on('videoRemoved', (video, peer) => {
        this.setState({videos: _.without(this.state.videos, video)})
    })

    this.setState({webRtcComponent: webrtc})
  }
})

module.exports = VCBox