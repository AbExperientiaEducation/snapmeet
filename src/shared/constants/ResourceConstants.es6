const keyMirror = require('keymirror')

const _resourceTypes = keyMirror({
  Meeting: null
  , Task: null
  , User: null
})

const _eventTypes = keyMirror({
  RECEIVE_RAW_EVENT: null
  , REST_ACTION_EVENT: null
  , REST_RESPONSE_EVENT: null
})

const exports = Object.assign(_eventTypes,{
  RestActions: keyMirror({
    GET: null
    , POST: null
    , DELETE: null
    , PATCH: null
    , BATCH_GET: null
  })
})

Object.keys(_resourceTypes).forEach(function(type) {
  exports[type] = {
    LABEL: type.toUpperCase()
    , ActionTypes: {
      CREATE: `CREATE_${type}`
      , PATCH: `PATCH_${type}`
    }
  }
})

module.exports = exports
