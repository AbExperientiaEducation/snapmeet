const React = require('react')
const SyncdocStore = require('../stores/SyncdocStore.es6')
const MUI = require('material-ui')
// Needed to add attach to prototype
require('share/lib/client/textarea.js')

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
        onChange={this.onTextChange}
      />
    )
  }

  , onTextChange() {
    if(!this.props.autoResize) return
    const actualInput = this.refs["input"].getDOMNode()
    const maxWidth = parseInt(actualInput.style.maxWidth.slice(0, -2))
    const scrollWidth = actualInput.children[0].scrollWidth
    if(maxWidth != scrollWidth) {
      actualInput.style.maxWidth = `${scrollWidth}px`
    }
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
    if(this.state.syncField) {
      this.state.syncField._doc.removeListener('after op', this.onTextChange)
      this.state.syncField.destroy()
    }
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
    const syncField = this.state.doc.attachTextarea(domTarget)
    this.setState({syncField: syncField})
    this.state.doc.on('after op', this.onTextChange)
    this.onTextChange()
    this.refs.input.getDOMNode().querySelector('input').placeholder = this.props.placeholder
  }
})

module.exports = SyncField
