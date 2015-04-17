const keyMirror = require('keymirror')

const _generateServerActions= function(type) {
  return {
    RECEIVE_RAW: `RECEIVE_RAW_${type}`
    , CREATE: `CREATE_${type}`
  }
}

const _resourceTypes = keyMirror({
  MEETING: null
  , TASK: null
})

const _actionTypes = {}
Object.keys(_resourceTypes).forEach(function(type) {
  _actionTypes[type] = _generateServerActions(type)
})

module.exports = {
  ResourceTypes: _resourceTypes
  , ActionTypes: _actionTypes
}
