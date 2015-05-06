const React = require('react')
const ReactPropTypes = React.PropTypes
const PureRenderMixin = require('react/addons').addons.PureRenderMixin
const VCRoomStore = require('../stores/VCRoomStore.es6')

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

  , componentDidMount() {
    VCRoomStore.addChangeListener(this._onChange)
  }

  , componentWillUnmount() {
    VCRoomStore.removeChangeListener(this._onChange)
  }

  , _onChange() {
    this.setState(getStateFromStore(this.props))
  }

  , render() {
    const vcRoom = this.state.vcRoom
    if(!vcRoom) return <div>Loading...</div>
    return (
      <div>{vcRoom.credentials}</div>
    )
  }
})

module.exports = VCBox