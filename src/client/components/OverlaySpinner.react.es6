const React = require('react')
const ReactPropTypes = React.PropTypes
const PureRenderMixin = require('react/addons').addons.PureRenderMixin
const Spinner = require('react-spinkit')
const MUI = require('material-ui')

const OverlaySpinner = React.createClass({
  mixins: [PureRenderMixin]
  , propTypes: {
    label: ReactPropTypes.string
  }

  , render() {
    return (
      <div className="full-screen-overlay">
        <div className="overlay-contents">
          <h2>{this.props.label}</h2>
          <Spinner spinnerName='wandering-cubes' noFadeIn/>
        </div>
      </div>
    )
  }
})

module.exports = OverlaySpinner