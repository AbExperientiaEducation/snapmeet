const SyncdocStore = require('../stores/SyncdocStore.es6')
const React = require('react')
const UserStore = require('../stores/UserStore.es6')
const QuillManager = require('../utils/QuillManager.es6')

const getStateFromStore = (props) => {
  const user = UserStore.currentUser()
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
    this.setupQuillIfNecessary()
  }

  , componentWillUnmount() {
    SyncdocStore.removeChangeListener(this._onChange)
    if(this.quillManager) {
      this.state.doc.removeListener('op', this.opListener)
      this.quillManager.die()
    }
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
    this.opListener = (op, isLocal) => {
      if(!isLocal) this.quillManager.updateContents(op)
    }
    this.state.doc.on('op', this.opListener)
  }
})

module.exports = SyncBox
