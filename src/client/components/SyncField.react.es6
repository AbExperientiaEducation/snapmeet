const React = require('react')
const SyncdocStore = require('../stores/SyncdocStore.es6')
const SessionStore = require('../stores/SessionStore.es6')
const QuillManager = require('../utils/QuillManager.es6')

const getStateFromStore = (props) => {
  const userSession = SessionStore.currentUserSession()
  const user = userSession && userSession.user || null
  const state = {
    doc: SyncdocStore.getDocument(props.id, true)
  }

  if(user) state.user = user
  return state
}

const SyncField = React.createClass({
  render() {
    return (
      <textarea className="sync-field">
      </textarea>
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
    const domTarget = React.findDOMNode(this)
    this.syncField = this.state.doc.attachTextarea(domTarget)
  }
})

module.exports = SyncField
