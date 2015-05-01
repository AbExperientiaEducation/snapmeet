const DBUsers = require('../db/users.es6')
const socketIOServer = require('../utils/SocketIOUtils.es6')
const ResourceConstants = require('../../shared/constants/ResourceConstants.es6')
const RestActions = ResourceConstants.RestActions

const getUsers = function(data) {
  // TODO: Add security here
  const ids = data.ids || [data.id] 
  return DBUsers.getWithRelations(ids)
}

const register = function() {
  const handler = function(data, userId) {
    switch(data.action) {
      case RestActions.GET:
        return getUsers(data)
    }
  }
  socketIOServer.registerResourceHandler(ResourceConstants.User.LABEL, handler)
}

module.exports = {
  register: register
}
