const React = require('react')
const ReactPropTypes = React.PropTypes
const PureRenderMixin = require('react/addons').addons.PureRenderMixin
const VCRoomStore = require('../stores/VCRoomStore.es6')
const _ = require('lodash')
const SocketStore = require('../stores/SocketIOStore.es6')
const SimpleWebRTC = require('simplewebrtc')
const SimpleWebRTCConnection = require ('../utils/SimpleWebRTCSocketConnection.es6')
const PeerVideo = require('./PeerVideo.react.es6')
const SelfVideo = require('./SelfVideo.react.es6')
const Immutable = require('immutable')
const MediaInputSelector = require('./MediaInputSelector.react.es6')
const MUI = require('material-ui')

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
      volume={videoObj.get('volume')}
    />
  }

  , makeSelfVideoComponent() {
    const localVideo =this.state.localVideo.get('video')
    const localVideoVolume = this.state.localVideo.get('volume')
    if(localVideo && localVideoVolume) {
      return <SelfVideo
            video={localVideo}
            volume={localVideoVolume}
          />
    } else {
      return <div></div>
    }
  }

  , componentDidMount() {
    VCRoomStore.addChangeListener(this._onChange)
  }

  , componentWillUnmount() {
    this.cleanupVC()
    VCRoomStore.removeChangeListener(this._onChange)
  }

  , cleanupVC() {
    if(this.state.webRtcComponent) {
      const webrtc = this.state.webRtcComponent
      webrtc.stopLocalVideo()
      webrtc.leaveRoom()
      webrtc.cleanup()
    }
    this.setState({localVideo: null, webRtcComponent: null})
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
      return <div className="meeting-join-widget"><MUI.RaisedButton disabled={true} label="Loading Video chat"></MUI.RaisedButton></div>
    } else if (!this.state.localVideo) {
      return <div className="meeting-join-widget">
        <MUI.RaisedButton onClick={this.joinChat} primary={true} label="Join video chat"></MUI.RaisedButton>
        <MUI.IconButton iconClassName="fa fa-info-circle" tooltip="Chat with up to 4 other people in this meeting"/>
      </div>
    } else {
      const videos = this.state.videos && this.state.videos.map(v => {return this.makeVideoComponent(v)})
      const localVideo = this.makeSelfVideoComponent()
      return <div className="meeting-join-widget">
        <div className="video-controls">
          <MUI.RaisedButton secondary={true} onClick={this.leaveChat} label="Leave video chat" />
          <MediaInputSelector webrtc={this.state.webRtcComponent} />
        </div>    
        <div className="videos">
          {localVideo}
          {videos}
        </div>
      </div>
    }
  }

  , joinChat() {
    this.setState({startVC: true}, this.setupWebRtcIfNecessary)
  }

  , leaveChat() {
    this.cleanupVC()
  }

  , setupWebRtcIfNecessary() {
    if(this.state.webRtcComponent || !this.state.startVC) return
    this.setState({videos: Immutable.Map(), localVideo: Immutable.Map({volume: -65})})
    // Create our WebRTC connection
    const webrtc = new SimpleWebRTC({
      // The DOM element that will hold "our" video
      localVideoEl: ''
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
    })
    webrtc.on('readyToCall', () => {
      webrtc.joinRoom(this.state.vcRoom.id, (err, roomInfo) => {
        if(err && err == 'full') {
          alert('Sorry, video Chat is full. Only 5 participants are allowed.')
          this.cleanupVC()
        }
      })
    })

    webrtc.on('localVideoAdded', (video) => {
      this.setState({localVideo: this.state.localVideo.set('video', video)})
    })

    webrtc.on('videoAdded', (video, peer) => {
      video.oncontextmenu = function () { return false }
      const videoObj = Immutable.Map({ video: video })
      this.setState({videos: this.state.videos.set(peer.id, videoObj)})

      if (peer && peer.pc) {
        // Want to add a child to the video container <div class=connectionstate></div>
        peer.pc.on('iceConnectionStateChange', (event) => {
          const targetVideo = this.state.videos.get(peer.id)
          if(!targetVideo) return
          const updatedVideo = targetVideo.set('connectionState', peer.pc.iceConnectionState)
          this.setState({videos: this.state.videos.set(peer.id, updatedVideo)})
        })
      }
    })

    webrtc.on('videoRemoved', (video, peer) => {
      this.setState({videos: this.state.videos.delete(peer.id)})
    })

    webrtc.on('volumeChange', (volume, treshold) => {
      this.setState({localVideo: this.state.localVideo.set('volume', volume)})
    })

    webrtc.on('remoteVolumeChange', (peer, volume) => {
      this.setState({videos: this.state.videos.setIn([ peer.id, 'volume'], volume)})
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
