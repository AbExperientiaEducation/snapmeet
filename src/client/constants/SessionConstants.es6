const keyMirror = require('keymirror');

module.exports = {
  ActionTypes: keyMirror({
    SIGN_IN: null
    , SIGN_IN_SUCCEEDED: null
    , SIGN_IN_FAILED: null
    , SIGN_UP: null
    , SIGN_UP_SUCCEEDED: null
    , SIGN_UP_FAILED: null
  })
}
