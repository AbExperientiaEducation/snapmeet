const ColorUtils = require('./ColorUtils.es6')
const Quill = require('quill')
const CursorTracking = require('./CursorTracking.es6')
const Shortid = require('shortid')
const _ = require('lodash')

const DOMString = `
<div>
  <div id="toolbar"> 
    <!-- Add font size dropdown -->
    <select class="ql-size">
      <option value="10">Small</option>
      <option value="13" selected>Normal</option>
      <option value="18">Large</option>
      <option value="32">Huge</option>
    </select>
    <span class="ql-format-group">
      <span title="Bold" class="ql-format-button ql-bold">
      </span>
      <span class="ql-format-separator">
      </span>
      <span title="Italic" class="ql-format-button ql-italic">
      </span>
      <span class="ql-format-separator">
      </span>
      <span title="Underline" class="ql-format-button ql-underline">
      </span>
      <span class="ql-format-separator">
      </span>
      <span title="Strikethrough" class="ql-format-button ql-strike">
      </span>
    </span>
    <span class="ql-format-group">
      <select title="Text Color" class="ql-color">
        <option value="rgb(0, 0, 0)" label="rgb(0, 0, 0)" selected></option>
        <option value="rgb(230, 0, 0)" label="rgb(230, 0, 0)"></option>
        <option value="rgb(255, 153, 0)" label="rgb(255, 153, 0)"></option>
        <option value="rgb(255, 255, 0)" label="rgb(255, 255, 0)"></option>
        <option value="rgb(0, 138, 0)" label="rgb(0, 138, 0)"></option>
        <option value="rgb(0, 102, 204)" label="rgb(0, 102, 204)"></option>
        <option value="rgb(153, 51, 255)" label="rgb(153, 51, 255)"></option>
        <option value="rgb(255, 255, 255)" label="rgb(255, 255, 255)"></option>
        <option value="rgb(250, 204, 204)" label="rgb(250, 204, 204)"></option>
        <option value="rgb(255, 235, 204)" label="rgb(255, 235, 204)"></option>
        <option value="rgb(255, 255, 204)" label="rgb(255, 255, 204)"></option>
        <option value="rgb(204, 232, 204)" label="rgb(204, 232, 204)"></option>
        <option value="rgb(204, 224, 245)" label="rgb(204, 224, 245)"></option>
        <option value="rgb(235, 214, 255)" label="rgb(235, 214, 255)"></option>
        <option value="rgb(187, 187, 187)" label="rgb(187, 187, 187)"></option>
        <option value="rgb(240, 102, 102)" label="rgb(240, 102, 102)"></option>
        <option value="rgb(255, 194, 102)" label="rgb(255, 194, 102)"></option>
        <option value="rgb(255, 255, 102)" label="rgb(255, 255, 102)"></option>
        <option value="rgb(102, 185, 102)" label="rgb(102, 185, 102)"></option>
        <option value="rgb(102, 163, 224)" label="rgb(102, 163, 224)"></option>
        <option value="rgb(194, 133, 255)" label="rgb(194, 133, 255)"></option>
        <option value="rgb(136, 136, 136)" label="rgb(136, 136, 136)"></option>
        <option value="rgb(161, 0, 0)" label="rgb(161, 0, 0)"></option>
        <option value="rgb(178, 107, 0)" label="rgb(178, 107, 0)"></option>
        <option value="rgb(178, 178, 0)" label="rgb(178, 178, 0)"></option>
        <option value="rgb(0, 97, 0)" label="rgb(0, 97, 0)"></option>
        <option value="rgb(0, 71, 178)" label="rgb(0, 71, 178)"></option>
        <option value="rgb(107, 36, 178)" label="rgb(107, 36, 178)"></option>
        <option value="rgb(68, 68, 68)" label="rgb(68, 68, 68)"></option>
        <option value="rgb(92, 0, 0)" label="rgb(92, 0, 0)"></option>
        <option value="rgb(102, 61, 0)" label="rgb(102, 61, 0)"></option>
        <option value="rgb(102, 102, 0)" label="rgb(102, 102, 0)"></option>
        <option value="rgb(0, 55, 0)" label="rgb(0, 55, 0)"></option>
        <option value="rgb(0, 41, 102)" label="rgb(0, 41, 102)"></option>
        <option value="rgb(61, 20, 102)" label="rgb(61, 20, 102)"></option>
      </select>
      <span class="ql-format-separator"></span>
      <select title="Background Color" class="ql-background">
        <option value="rgb(0, 0, 0)" label="rgb(0, 0, 0)"></option>
        <option value="rgb(230, 0, 0)" label="rgb(230, 0, 0)"></option>
        <option value="rgb(255, 153, 0)" label="rgb(255, 153, 0)"></option>
        <option value="rgb(255, 255, 0)" label="rgb(255, 255, 0)"></option>
        <option value="rgb(0, 138, 0)" label="rgb(0, 138, 0)"></option>
        <option value="rgb(0, 102, 204)" label="rgb(0, 102, 204)"></option>
        <option value="rgb(153, 51, 255)" label="rgb(153, 51, 255)"></option>
        <option value="rgb(255, 255, 255)" label="rgb(255, 255, 255)" selected></option>
        <option value="rgb(250, 204, 204)" label="rgb(250, 204, 204)"></option>
        <option value="rgb(255, 235, 204)" label="rgb(255, 235, 204)"></option>
        <option value="rgb(255, 255, 204)" label="rgb(255, 255, 204)"></option>
        <option value="rgb(204, 232, 204)" label="rgb(204, 232, 204)"></option>
        <option value="rgb(204, 224, 245)" label="rgb(204, 224, 245)"></option>
        <option value="rgb(235, 214, 255)" label="rgb(235, 214, 255)"></option>
        <option value="rgb(187, 187, 187)" label="rgb(187, 187, 187)"></option>
        <option value="rgb(240, 102, 102)" label="rgb(240, 102, 102)"></option>
        <option value="rgb(255, 194, 102)" label="rgb(255, 194, 102)"></option>
        <option value="rgb(255, 255, 102)" label="rgb(255, 255, 102)"></option>
        <option value="rgb(102, 185, 102)" label="rgb(102, 185, 102)"></option>
        <option value="rgb(102, 163, 224)" label="rgb(102, 163, 224)"></option>
        <option value="rgb(194, 133, 255)" label="rgb(194, 133, 255)"></option>
        <option value="rgb(136, 136, 136)" label="rgb(136, 136, 136)"></option>
        <option value="rgb(161, 0, 0)" label="rgb(161, 0, 0)"></option>
        <option value="rgb(178, 107, 0)" label="rgb(178, 107, 0)"></option>
        <option value="rgb(178, 178, 0)" label="rgb(178, 178, 0)"></option>
        <option value="rgb(0, 97, 0)" label="rgb(0, 97, 0)"></option>
        <option value="rgb(0, 71, 178)" label="rgb(0, 71, 178)"></option>
        <option value="rgb(107, 36, 178)" label="rgb(107, 36, 178)"></option>
        <option value="rgb(68, 68, 68)" label="rgb(68, 68, 68)"></option>
        <option value="rgb(92, 0, 0)" label="rgb(92, 0, 0)"></option>
        <option value="rgb(102, 61, 0)" label="rgb(102, 61, 0)"></option>
        <option value="rgb(102, 102, 0)" label="rgb(102, 102, 0)"></option>
        <option value="rgb(0, 55, 0)" label="rgb(0, 55, 0)"></option>
        <option value="rgb(0, 41, 102)" label="rgb(0, 41, 102)"></option>
        <option value="rgb(61, 20, 102)" label="rgb(61, 20, 102)"></option>
      </select>
    </span>
    <span class="ql-format-group">
      <span title="List" class="ql-format-button ql-list"></span>
      <span class="ql-format-separator"></span>
      <span title="Bullet" class="ql-format-button ql-bullet"></span>
      <span class="ql-format-separator"></span>
      <select title="Text Alignment" class="ql-align">
        <option value="left" label="Left" selected></option>
        <option value="center" label="Center"></option>
        <option value="right" label="Right"></option>
        <option value="justify" label="Justify"></option>
      </select>
    </span>
  </div>
  <div id="editor"></div>
  <div id="authors"></div>
</div>`

class QuillManager {
  constructor(docId, user, onOpFn, domTarget, initialContents) {
    this.updateUserData(user || {})
    this.docId = docId
    this.quillBox = this.quillBoxForDom(domTarget, onOpFn)
    this.quillBox.setContents(initialContents)
    this.initCursorTracking()
  }

  quillBoxForDom(domTarget, onOpFn) {
    domTarget.innerHTML = DOMString
    const quillOptions = {
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
    }

    if (window.matchMedia('(max-device-width: 767px)').matches) {
      quillOptions.styles = {
        '.ql-editor': {
          'font-size': '40px'  
        }
      }
    }

    const quillBox = new Quill('#editor', quillOptions)

    quillBox.on('text-change', (delta, source) => {
      if(source !== 'user') return
      // Quill changes ops after it emits the text change event. This
      // is to support atomic undo in their editor. It has the nasty side-effect
      // that if there is a delay before we submit the op, it could change on us
      // Deep clone to guard against this possibility.
      const ops = _.cloneDeep(delta.ops)
      onOpFn(ops)
    })

    return quillBox
  }

  die() {
    CursorTracking.removeCursorChangeListener(this.docId)
    this.quillBox.editor.destroy()
    this.quillBox.destroy()
  }

  initCursorTracking() {
    const cursorModule = this.quillBox.addModule('multi-cursor', {
      timeout: 7000
    })

    this.quillBox.on('selection-change', (range) => {
      const pos = range ? range.end : null
      CursorTracking.broadcastCursor(this.docId, this.authorId, this.displayName, pos)
    })

    this.colorGenerator = ColorUtils.uniqueColorGenerator()
    CursorTracking.addCursorChangeListener(this.docId, (userId, displayString, cursorPos) => {
      const docLength = this.quillBox.getLength()
      // There is a race condition where we get a cursor position before a text change. 
      // Ensure we never try to set an index > document length
      if(userId !== this.authorId && docLength > cursorPos) {
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
