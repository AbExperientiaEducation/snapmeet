const DBUsers = require('../db/users.es6')
const socketIOServer = require('../utils/SocketIOUtils.es6')
const ResourceConstants = require('../../shared/constants/ResourceConstants.es6')
const RestActions = ResourceConstants.RestActions

const getUsers = function(data, userId) {
  // Users can only see their own relations (for now)
  if(data.id === userId) {
    return DBUsers.getWithRelations([data.id])  
  } else {
    const ids = data.ids || [data.id]
    return DBUsers.getRecords(ids)
  }
}

const associateToUser = function(data, userId) {
  // TODO: Currently hard coded, will need to switch on reltype
  const relName = 'USER_MEETING'
  return DBUsers.relateRecordToUser(data.id, userId, relName)
}

const register = function() {
  const handler = function(data, userId) {
    switch(data.action) {
      case RestActions.GET:
        return getUsers(data, userId)
      case ResourceConstants.OtherActions.ASSOCIATE_TO_USER:
        return associateToUser(data, userId)
    }
  }
  socketIOServer.registerResourceHandler(ResourceConstants.User.LABEL, handler)
}

module.exports = {
  register: register
}
