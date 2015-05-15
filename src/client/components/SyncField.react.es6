const React = require('react')
const SyncdocStore = require('../stores/SyncdocStore.es6')
const MUI = require('material-ui')

const getStateFromStore = (props) => {
  return {
    doc: SyncdocStore.getDocument(props.id, true)
  }
}

const SyncField = React.createClass({
  render() {
    return (      
      <MUI.TextField
        disabled={!this.state.doc}
        ref="input"
        />
    )
  }

  , getInitialState() {
    return getStateFromStore(this.props)
  }

  , componentDidMount() {
    SyncdocStore.addChangeListener(this._onChange)
    this.setupSyncFieldIfNecessary()
  }

  , componentWillUnmount() {
    SyncdocStore.removeChangeListener(this._onChange)
    if(this.state.syncField) this.state.syncField.destroy();
  }

  , _onChange() {
    this.setState(getStateFromStore(this.props))
    this.setupSyncFieldIfNecessary()
  }

  , setupSyncFieldIfNecessary() {
    if(this.state.syncField && !this.state.doc) {
      this.state.syncField.destroy()
      this.setState({doc: null})
    }
    if(this.state.syncField || !this.state.doc) return
    const domTarget = React.findDOMNode(this).getElementsByTagName('input')[0]
    // Manually set value once. This will clear out hint text/prevent visual bug.
    this.refs.input.setValue(this.state.doc.getSnapshot())
    this.setState({syncField: this.state.doc.attachTextarea(domTarget)})
    this.refs.input.getDOMNode().querySelector('input').placeholder = this.props.placeholder
  }
})

module.exports = SyncField
