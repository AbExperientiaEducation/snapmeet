const DBOrgs = require('../db/orgs.es6')
const socketIOServer = require('../utils/SocketIOUtils.es6')
const ResourceConstants = require('../../shared/constants/ResourceConstants.es6')
const RestActions = ResourceConstants.RestActions

const createOrg = function(data) {
  const orgJson = data.resource
  return DBTasks.create(orgJson)
}

const getOrg = function(data) {
  return DBOrgs.getWithRelations(data.id)
}

const register = function() {
    const handler = function(data) {
    switch(data.action) {
      case RestActions.GET:
        return getOrg(data)
      case RestActions.POST:
        return createOrg(data)
    }
  }
  socketIOServer.registerResourceHandler(ResourceConstants.Org.LABEL, handler)
}

module.exports = {
  register: register
}
