const ColorUtils = require('./ColorUtils.es6')
const Quill = require('quill')
const SyncConnUtils = require('./SyncConnUtils.es6')
const Shortid = require('shortid')

class QuillManager {
  constructor(docId, user, onOpFn, domTarget, initialContents) {
    this.updateUserData(user || {})
    this.docId = docId
    this.quillBox = this.quillBoxForDom(domTarget, onOpFn)
    this.quillBox.setContents(initialContents)
    this.initCursorTracking()
  }

  quillBoxForDom(domTarget, onOpFn) {
    domTarget.innerHTML = '<div id="toolbar">' + 
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

    const quillBox = new Quill('#editor', {
      modules: {
        'authorship': {
          authorId: this.authorId
          , enabled: true
        }
        , 'toolbar': {
          container: '#toolbar'
        }
        , 'link-tooltip': true
      },
      theme: 'snow'
    })

    quillBox.on('text-change', (delta, source) => {
      if(source !== 'user') return
      onOpFn(delta.ops)
    })

    return quillBox
  }

  die() {
    SyncConnUtils.removeCursorChangeListener(this.docId) 
    this.quillBox.editor.destroy()
  }

  initCursorTracking() {
    const cursorModule = this.quillBox.addModule('multi-cursor', {
      timeout: 7000
    })

    this.quillBox.on('selection-change', (range) => {
      const pos = range ? range.end : null
      SyncConnUtils.broadcastCursor(this.docId, this.authorId, this.displayName, pos)
    })

    this.colorGenerator = ColorUtils.uniqueColorGenerator()
    SyncConnUtils.addCursorChangeListener(this.docId, (userId, displayString, cursorPos) => {
      if(userId !== this.authorId) {
        cursorModule.setCursor(userId, cursorPos, displayString, this.colorGenerator.colorForId(userId))  
      }
    })
  }

  updateUserData(user) {
    this.authorId = user.id || Shortid.generate()
    this.displayName = user.email || 'Anonymous'
  }

  updateContents() {
    this.quillBox.updateContents.apply(this.quillBox, arguments)
  }
}

module.exports = QuillManager
