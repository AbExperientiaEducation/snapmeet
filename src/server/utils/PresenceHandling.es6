const _resourcePresenceTable = {}
const _socketPresenceTable = {}
const SocketConstants = require('../../shared/constants/SocketEventConstants.es6')
const _ = require('lodash')
const ErrorLogger = require('../../shared/utils/ErrorLogger.es6')

const addToTable = function(table, key, value) {
  if(!table[key]) table[key] = []
  table[key].push(value)
}

const removeFromTable = function(table, key, value, tableName) {
  const currentValues = table[key] || []
  const index = currentValues.indexOf(value)
  if(index === -1) {
    return ErrorLogger.log(`Attempted to remove ${value} from key: ${key} in ${tableName}, but value was not found.`)
  }
  table[key].splice(index, 1)
  if(table[key].length == 0) delete table[key]
}

const broadcastPresenceData = function(socket, resourceId) {
  const presentUsers = _.uniq(_resourcePresenceTable[resourceId])
  socket.emit(SocketConstants.SERVER_BROADCAST_PRESENCE, {
    resourceId: resourceId
    , presentUsers: presentUsers 
  })
  socket.broadcast.to(resourceId).emit(SocketConstants.SERVER_BROADCAST_PRESENCE, {
    resourceId: resourceId
    , presentUsers: presentUsers
  })
}

const addToPresenceTables = function(socket, resourceId, userId) {
  addToTable(_resourcePresenceTable, resourceId, userId)
  addToTable(_socketPresenceTable, socket.id, resourceId)
  broadcastPresenceData(socket, resourceId)
}

const removeFromPresenceTables = function(socket, resourceId, userId) {
  removeFromTable(_resourcePresenceTable, resourceId, userId, "Resource Presence Table")
  removeFromTable(_socketPresenceTable, socket.id, resourceId, "Socket Presence Table")
  broadcastPresenceData(socket, resourceId)
}

const initializePresenceHandling = function(socket, userId) {
  
  // Handle join presence
  socket.on(SocketConstants.CLIENT_JOIN_PRESENCE, (data) => {
    const resourceId = data.resourceType + data.resourceId
    addToPresenceTables(socket, resourceId, userId)
  })

  // Handle leave presence
  socket.on(SocketConstants.CLIENT_LEAVE_PRESENCE, (data) => {
    const resourceId = data.resourceType + data.resourceId
    removeFromPresenceTables(socket, resourceId, userId)
  })

  // Handle disconnect
  socket.on('disconnect', () => {
    const resourceIds = _socketPresenceTable[socket.id] || []
    resourceIds.forEach(resourceId => {
      removeFromPresenceTables(socket, resourceId, userId)
    })
  })
}

module.exports = {
  initializePresenceHandling: initializePresenceHandling
}
