const React = require('react')
const ReactPropTypes = React.PropTypes
const PureRenderMixin = require('react/addons').addons.PureRenderMixin
const AudioIndicator = require('./AudioIndicator.react.es6')
const _ = require('lodash')

const labelSources = function(label, sources) {
  let inputNum = 0
  // Sources are some weird native that are immutable. 
  sources = sources.map(source => {
    const pojoSource = Object.assign({}, source)
    if(pojoSource.label.length === 0) {
      inputNum++
      pojoSource.label = `${label} ${inputNum}`
    }
    return pojoSource
  })
  return sources
}

const InputSelector = React.createClass({
  mixins: [PureRenderMixin]
  , propTypes: {
    webrtc: ReactPropTypes.object
  }

  , getInitialState() {return {}}

  , makePicker(title, sources, selectedId, callback) {
    const options = sources.map(s => {return <option  value={s.id}>{s.label}</option>})
    return <div>
      <span>{title}</span>
      <select value={selectedId} onChange={callback}>
        {options}
      </select>
    </div>
  }

  , changeAudio(event) {
    this.props.webrtc.stopLocalVideo()
    this.props.webrtc.config.media.audio = {
      mandatory: {sourceId: event.target.value}
    }
    this.props.webrtc.startLocalVideo()
    this.setState({activeAudio: event.target.value})
  }

  , changeVideo(event) {
    this.props.webrtc.stopLocalVideo()
    this.props.webrtc.config.media.video = {
      mandatory: {sourceId: event.target.value}
    }
    this.props.webrtc.startLocalVideo()
    this.setState({activeVideo: event.target.value})
  }

  , componentDidMount() {
    if (MediaStreamTrack instanceof Object && MediaStreamTrack.getSources) {
      // audio and video
      MediaStreamTrack.getSources((sourceInfos) => {
        const groupedSources = _.groupBy(sourceInfos, 'kind')
        const audioSources = labelSources('Microphone', groupedSources.audio)
        const videoSources = labelSources('Camera', groupedSources.video)
        this.setState({
          audioDevices: audioSources
          , videoDevices: videoSources
          , ready: true
          , activeAudio: audioSources[0]
          , activeVideo: videoSources[0]
        })    
      })
    } else {
      this.setState({ready: true, noCustomize:true})
      
    }
  }

  , render() {
    if(!this.state.ready) {
      return <div>Detecting Media Inputs</div>
    } else if (this.state.noCustomize) {
      // Firefox only allows selecting sources at the browser level
      return <span></span>
    } else {
      const audioOptions = this.makePicker('Audio: ', this.state.audioDevices, this.state.activeAudio.id, this.changeAudio)
      const videoOptions = this.makePicker('Video: ', this.state.videoDevices, this.state.activeVideo.id, this.changeVideo)
      return <div>
        {audioOptions}
        {videoOptions}
      </div>
    }
  }
})

module.exports = InputSelector