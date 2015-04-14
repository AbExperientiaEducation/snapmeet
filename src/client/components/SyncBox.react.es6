const SyncdocStore = require('../stores/SyncdocStore.es6')
const SyncConnUtils = require('../utils/SyncConnUtils.es6')
const ColorUtils = require('../utils/ColorUtils.es6')
const React = require('react')
const Quill = require('quill')

const getStateFromStore = () => {
  return { 
    doc: SyncdocStore.getDocument('foodoc')
  }
}

const SyncBox = React.createClass({
  render() {
    return (
      <div className="sync-box">
      </div>
    )
  }

  , getInitialState() {
    return getStateFromStore()
  }

  //  Never re-render. Ensures we don't break our quill binding
  , shouldComponentUpdate() { return false }

  , componentDidMount() {
    SyncdocStore.addChangeListener(this._onChange)
    this.setupQuillIfNecessary()
  }

  , componentWillUnmount() {
    quillBox.editor.destroy()
    SyncConnUtils.removeCursorChangeListener('foodoc') 
    SyncdocStore.removeChangeListener(this._onChange)
  }

  , _onChange() {
    this.setState(getStateFromStore())
    this.setupQuillIfNecessary()
  }

  , setupQuillIfNecessary() {
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

      const authorId = Math.random(100)
      this.quillBox = new Quill('#editor', {
        modules: {
          'authorship': {
            authorId: 'Author' + authorId,
            enabled: true
          },
          'toolbar': {
            container: '#toolbar'
          },
          'link-tooltip': true
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
        SyncConnUtils.broadcastCursor('foodoc', authorId, pos)
      })

      this.colorGenerator = ColorUtils.uniqueColorGenerator()
      SyncConnUtils.addCursorChangeListener('foodoc', (userId, cursorPos) => {
        if(userId !== authorId) {
          cursorModule.setCursor(userId, cursorPos, 'anonymous', this.colorGenerator.colorForId(userId))  
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
