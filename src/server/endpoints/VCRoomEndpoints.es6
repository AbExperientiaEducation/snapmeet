const DBVCRooms = require('../db/vcrooms.es6')
const socketIOServer = require('../utils/SocketIOUtils.es6')
const ResourceConstants = require('../../shared/constants/ResourceConstants.es6')
const RestActions = ResourceConstants.RestActions

const getRoom = function(data) {
  return DBVCRooms.getWithCredentials(data.ids[0])
}

const register = function() {
  const handler = function(data) {
    switch(data.action) {
      case RestActions.GET_BATCH:
      case RestActions.GET:
        console.log('received get')
        return getRoom(data)
    }
  }
  socketIOServer.registerResourceHandler(ResourceConstants.VCRoom.LABEL, handler)
}

module.exports = {
  register: register
}
