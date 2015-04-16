const SyncdocStore = require('../stores/SyncdocStore.es6')
const React = require('react')
const SessionStore = require('../stores/SessionStore.es6')
const QuillManager = require('../utils/QuillManager.es6')


const getStateFromStore = (props) => {
  const userSession = SessionStore.currentUserSession()
  const user = userSession && userSession.user || null
  const state = {
    doc: SyncdocStore.getDocument(props.id)
  }

  if(user) state.user = user
  return state
}

const SyncBox = React.createClass({
  render() {
    return (
      <div className="sync-box">
      </div>
    )
  }

  , getInitialState() {
    return getStateFromStore(this.props)
  }

  //  Never re-render. Ensures we don't break our quill binding
  , shouldComponentUpdate() { return false }

  , componentDidMount() {
    SyncdocStore.addChangeListener(this._onChange)
  }

  , componentWillUnmount() {
    SyncdocStore.removeChangeListener(this._onChange)
    this.QuillManager && this.QuillManager.die()
  }

  , _onChange() {
    this.setState(getStateFromStore(this.props))
    this.setupQuillIfNecessary()
  }

  , setupQuillIfNecessary() {
    if(this.quillManager || !this.state.doc) return
    const onOpFn = (ops) => {this.state.doc.submitOp(ops)}
    const domTarget = React.findDOMNode(this)
    const initialContents = this.state.doc.getSnapshot().ops
    this.quillManager = new QuillManager(this.props.id, this.state.user, onOpFn, domTarget, initialContents)
    this.state.doc.on('op', (op, isLocal) => {
      if(!isLocal) this.quillManager.updateContents(op)
    })
  }
})

module.exports = SyncBox
