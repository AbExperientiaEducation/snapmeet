const keyMirror = require('keymirror')

const _resourceTypes = keyMirror({
  Meeting: null
  , Task: null
})

const exports = {
  RECEIVE_RAW_EVENT: 'RECEIVE_RAW_EVENT'
  , REST_ACTION_EVENT: 'REST_ACTION_EVENT'
  , REST_RESPONSE_EVENT: 'REST_RESPONSE_EVENT'
  , RestActions: {
    GET: 'GET'
    , POST: 'POST'
    , DELETE: 'DELETE'
    , PATCH: 'PATCH'
  }
}
Object.keys(_resourceTypes).forEach(function(type) {
  exports[type] = {
    LABEL: type.toUpperCase()
    , ActionTypes: {
      CREATE: `CREATE_${type}`
    }
  }
})

module.exports = exports
