const React = require('react')
const PureRenderMixin = require('react/addons').addons.PureRenderMixin
const MeetingStore = require('../stores/MeetingStore.es6')
const SyncBox = require('./SyncBox.react.es6')

const getStateFromStore = (props) => {
  return {
    meeting: MeetingStore.get(props.params.id)
  }
}

const MeetingDetailPage = React.createClass({
  mixins: [PureRenderMixin]

  , getInitialState() {
    return getStateFromStore(this.props)
  }

  , componentDidMount() {
    MeetingStore.addChangeListener(this._onChange)
  }

  , componentWillUnmount() {
    MeetingStore.removeChangeListener(this._onChange)
  }

  , render() {
    if(this.state.meeting) {
      return (
        <div className="meeting-detail">
          <h2>Page for { this.state.meeting.id }</h2>
          <SyncBox id={ this.state.meeting.id } /> 
        </div>
      )      
    } else {
      return (
        <div>Loading...</div>
      )
    }
  }

  , _onChange() {
    this.setState(getStateFromStore(this.props))
  }
})

module.exports = MeetingDetailPage