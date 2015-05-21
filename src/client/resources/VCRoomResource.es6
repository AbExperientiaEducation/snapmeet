const SMResource = require('./SMResource.es6')
const ResourceConstants = require('../../shared/constants/ResourceConstants.es6')

const VCRoomResource = new SMResource({
  type: ResourceConstants.VCRoom.LABEL
  , recordProperties: {
    credentials: null
  }
  // Note: credentials is a virtual property. It's not stored on the record,
  // but created by the server on demand. Servers are unique per user.
})

module.exports = VCRoomResource
