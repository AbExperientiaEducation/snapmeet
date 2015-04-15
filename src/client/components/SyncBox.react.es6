const SyncdocStore = require('../stores/SyncdocStore.es6')
const SyncConnUtils = require('../utils/SyncConnUtils.es6')
const ColorUtils = require('../utils/ColorUtils.es6')
const React = require('react')
const Quill = require('quill')
const Shortid = require('shortid')
const SessionStore = require('../stores/SessionStore.es6')

const getStateFromStore = (props) => {
  const userSession = SessionStore.currentUserSession()
  const user = userSession && userSession.user || null
  const state = {
    doc: SyncdocStore.getDocument(props.id)
  }

  if(user) {
    Object.assign(state, {
      userDisplayString: user.email
    , userId: user.id
    })
  }

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
    this.quillBox.editor.destroy()
    SyncConnUtils.removeCursorChangeListener(this.props.id) 
    SyncdocStore.removeChangeListener(this._onChange)
  }

  , _onChange() {
    this.setState(getStateFromStore(this.props))
    this.setupQuillIfNecessary()
  }

  , setupQuillIfNecessary() {
    const docId = this.props.id
    const displayString = this.state.userDisplayString || 'anonymous'
    if(!this.quillBox && this.state.doc) {
      React.findDOMNode(this).innerHTML = '<div id="toolbar">' + 
        '<!-- Add font size dropdown -->' +
        '<select class="ql-size">' +
          '<option value="10">Small</option>' +
          '<option value="13" selected>Normal</option>' +
          '<option value="18">Large</option>' +
          '<option value="32">Huge</option>' +
        '</select>' +
        '<!-- Add a bold button -->' +
        '<button class="ql-bold ql-format-button" title="Bold"></button>' +
      '</div>' +
      '<div id="editor"></div>' +
      '<div id="authors"></div>'

      const authorId = this.state.userId || 'Author' + Shortid.generate()
      this.quillBox = new Quill('#editor', {
        modules: {
          'authorship': {
            authorId: authorId
            , enabled: true
          }
          , 'toolbar': {
            container: '#toolbar'
          }
          , 'link-tooltip': true
        },
        theme: 'snow'
      })

      this.quillBox.on('text-change', (delta, source) => {
        if(source !== 'user') return
        this.state.doc.submitOp(delta.ops)
      })

      const cursorModule = this.quillBox.addModule('multi-cursor', {
        timeout: 7000
      })

      this.quillBox.on('selection-change', function(range){
        const pos = range ? range.end : null
        SyncConnUtils.broadcastCursor(docId, authorId, displayString, pos)
      })

      this.colorGenerator = ColorUtils.uniqueColorGenerator()
      SyncConnUtils.addCursorChangeListener(docId, (userId, displayString, cursorPos) => {
        if(userId !== authorId) {
          cursorModule.setCursor(userId, cursorPos, displayString, this.colorGenerator.colorForId(userId))  
        }
      })

      this.quillBox.setContents(this.state.doc.getSnapshot().ops)
      this.state.doc.on('op', (op, isLocal) => {
        if(!isLocal) this.quillBox.updateContents(op)
      })

    } 
  }

  , quillBox: null
})

module.exports = SyncBox
