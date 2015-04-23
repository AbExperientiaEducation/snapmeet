const keyMirror = require('keymirror')

const _resourceTypes = keyMirror({
  Meeting: null
  , Task: null
})

const _eventTypes = keyMirror({
  RECEIVE_RAW_EVENT: null
  , REST_ACTION_EVENT: null
  , REST_RESPONSE_EVENT: null
})

const exports = Object.assign(_eventTypes,{
  RECEIVE_RAW_EVENT: 'RECEIVE_RAW_EVENT'
  , REST_ACTION_EVENT: 'REST_ACTION_EVENT'
  , REST_RESPONSE_EVENT: 'REST_RESPONSE_EVENT'
  , RestActions: keyMirror({
    GET: null
    , POST: null
    , DELETE: null
    , PATCH: null
  })
})

Object.keys(_resourceTypes).forEach(function(type) {
  exports[type] = {
    LABEL: type.toUpperCase()
    , ActionTypes: {
      CREATE: `CREATE_${type}`
    }
  }
})

module.exports = exports
