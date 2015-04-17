const keyMirror = require('keymirror')

const _generateServerActions= function() {
  return keyMirror({
    RECEIVE_RAW: null
    , CREATE: null
  })
}

const _resourceTypes = keyMirror({
  MEETING: null
  , TASK: null
})

const _actionTypes = {}
Object.keys(_resourceTypes).forEach(function(type) {
  _actionTypes[type] = _generateServerActions()
})

module.exports = {
  ResourceTypes: _resourceTypes
  , ActionTypes: _actionTypes
}
