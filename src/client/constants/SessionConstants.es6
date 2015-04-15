const keyMirror = require('keymirror');

module.exports = {
  ActionTypes: keyMirror({
    SIGN_IN: null
    , SIGN_IN_SUCCEEDED: null
    , SIGN_IN_FAILED: null
    , REGISTER: null
    , REGISTRATION_SUCCEEDED: null
    , REGISTRATION_FAILED: null
  })
}
