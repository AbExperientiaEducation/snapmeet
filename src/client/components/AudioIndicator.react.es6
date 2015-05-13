const React = require('react')
const ReactPropTypes = React.PropTypes
const PureRenderMixin = require('react/addons').addons.PureRenderMixin
const _ = require('lodash')

const AudioIndicator = React.createClass({
  mixins: [PureRenderMixin]
  , propTypes: {
    volume: ReactPropTypes.number
  }

  , updateVolume(volume) {
    const newVol = volume > -65 ? volume : -65
    const oldVol = this.state.volume || -65
    let meterVolume
    if(newVol > oldVol) {
      meterVolume = newVol
    } else {
      // Smooth out volume decay so it's not crazy jumpy
      meterVolume = (oldVol + newVol / 3) * 3/4
    }
    this.setState({volume: meterVolume})
  }

  , componentWillMount() {
    this.throttledVolumeChange = _.throttle(this.updateVolume, 200, true)
  }

  , getInitialState() {
    return({volume: this.props.volume || -65})
  }

  , componentWillReceiveProps(nextProps) {
    const newVol = nextProps.volume
    if(newVol > this.state.volume) {
      // We want to always pick up increases in volume
      this.updateVolume(newVol)
    } else {
      this.throttledVolumeChange(newVol)  
    }
  }

  , render() {
    return <meter 
        className="volume"
        value={this.state.volume}
        min="-65"
        max="-20"
        low="-50"
        high="-25"
      ></meter>
  }
})

module.exports = AudioIndicator