const React = require('react')
const ReactPropTypes = React.PropTypes
const PureRenderMixin = require('react/addons').addons.PureRenderMixin
const VCRoomStore = require('../stores/VCRoomStore.es6')
const _ = require('lodash')
const SocketStore = require('../stores/SocketIOStore.es6')
const SimpleWebRTC = require('simplewebrtc')
const SimpleWebRTCConnection = require ('../utils/SimpleWebRTCSocketConnection.es6')
const PeerVideo = require('./PeerVideo.react.es6')
const Immutable = require('immutable')

const getStateFromStore = (props) => {
  const relatedRoomArray = VCRoomStore.getResourcesFromRelation(props.meetingId, 'MEETING_VCROOM')
  return {
    vcRoom: relatedRoomArray ? relatedRoomArray.first() : null
  }
}

const VCBox = React.createClass({
  mixins: [PureRenderMixin]

  , propTypes: {
    meetingId: ReactPropTypes.string
  }

  , getInitialState() {
    return getStateFromStore(this.props)
  }

  , makeVideoComponent(videoObj) {
    return <PeerVideo 
      video={videoObj.get('video')}
      connectionState={videoObj.get('connectionState')}
    />
  }

  , componentDidMount() {
    VCRoomStore.addChangeListener(this._onChange)
  }

  , componentWillUnmount() {
    if(this.state.webRtcComponent) {
      const webrtc = this.state.webRtcComponent
      webrtc.stopLocalVideo()
      webrtc.leaveRoom()
      webrtc.cleanup()
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
        <div className="others-video">
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
    this.setState({videos: Immutable.Map()})
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
      , connection: SimpleWebRTCConnection(SocketStore.getSocket())
      , logger: function(){}
    })
    webrtc.on('readyToCall', () => {
      webrtc.joinRoom(this.state.vcRoom.id)
    })      

    webrtc.on('videoAdded', (video, peer) => {
      video.oncontextmenu = function () { return false }
      const videoObj = Immutable.Map({ video: video })
      this.setState({videos: this.state.videos.set(video.id, videoObj)})

      if (peer && peer.pc) {
        // Want to add a child to the video container <div class=connectionstate></div>
        peer.pc.on('iceConnectionStateChange', (event) => {
          const targetVideo = this.state.videos.get(video.id)
          if(!targetVideo) return
          const updatedVideo = targetVideo.set('connectionState', peer.pc.iceConnectionState)
          this.setState({videos: this.state.videos.set(video.id, updatedVideo)})
        })
      }
    })

    webrtc.on('videoRemoved', (video, peer) => {
      this.setState({videos: this.state.videos.delete(video.id)})
    })

    // If we've gotten this far, we already have a connection.
    // These are the methods simplewebrtc uses to tell itself
    // that it is connected
    webrtc.emit('connectionReady', webrtc.connection.getSessionid())
    webrtc.sessionReady = true
    webrtc.testReadiness()

    this.setState({webRtcComponent: webrtc})
  }
})

module.exports = VCBox
