const React = require('react')
const SyncdocStore = require('../stores/SyncdocStore.es6')

const getStateFromStore = (props) => {
  return {
    doc: SyncdocStore.getDocument(props.id, true)
  }
}

const SyncOutput = React.createClass({
  render() {
    if(!this.state.doc) {
      return <div>Loading</div>
    }
    const title = this.state.doc.getSnapshot() || "Untitled Meeting"
    return (      
      <div>{title}</div>
    )
  }

  , getInitialState() {
    return getStateFromStore(this.props)
  }

  , componentDidMount() {
    SyncdocStore.addChangeListener(this._onChange)
  }

  , componentWillUnmount() {
    SyncdocStore.removeChangeListener(this._onChange)
  }

  , _onChange() {
    this.setState(getStateFromStore(this.props))
  }
})

module.exports = SyncOutput
