const React = require('react')
const SyncdocStore = require('../stores/SyncdocStore.es6')
const UserStore = require('../stores/UserStore.es6')
const QuillManager = require('../utils/QuillManager.es6')
const MUI = require('material-ui')

const getStateFromStore = (props) => {
  const user = UserStore.currentUser()
  const state = {
    doc: SyncdocStore.getDocument(props.id, true)
  }

  if(user) state.user = user
  return state
}

const SyncField = React.createClass({
  render() {
    return (      
      <MUI.TextField 
        ref="input"
        />
    )
  }

  , getInitialState() {
    return getStateFromStore(this.props)
  }

  //  Never re-render. Ensures we don't break our sharejs binding
  , shouldComponentUpdate() { return false }

  , componentDidMount() {
    SyncdocStore.addChangeListener(this._onChange)
    this.setupSyncFieldIfNecessary()
  }

  , componentWillUnmount() {
    SyncdocStore.removeChangeListener(this._onChange)
    if(this.syncField) this.syncField.destroy();
  }

  , _onChange() {
    this.setState(getStateFromStore(this.props))
    this.setupSyncFieldIfNecessary()
  }

  , setupSyncFieldIfNecessary() {
    if(this.syncField || !this.state.doc) return
    const domTarget = React.findDOMNode(this).getElementsByTagName('input')[0]
    // Manually set value once. This will clear out hint text/prevent visual bug.
    this.refs.input.setValue(this.state.doc.getSnapshot())
    this.syncField = this.state.doc.attachTextarea(domTarget)
    this.refs.input.getDOMNode().querySelector('input').placeholder = this.props.placeholder
  }
})

module.exports = SyncField
