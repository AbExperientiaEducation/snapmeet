const keyMirror = require('keymirror')
const constants = keyMirror({
  SHARE_JS_READY: null
  , SHARE_JS_DATA: null
  , CURSOR_SUBSCRIBE: null
  , CURSOR_UNSUBSCRIBE: null
  , CURSOR_DATA: null
})

constants.TASK_SUFFIX = '_task_title'

module.exports = constants
