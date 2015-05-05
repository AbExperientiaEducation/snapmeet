const MGResource = require('./MGResource.es6')
const ResourceConstants = require('../../shared/constants/ResourceConstants.es6')

const VCRoomResource = new MGResource({
  type: ResourceConstants.VCRoom.LABEL
  , recordProperties: {
    ready: false
  }
})

module.exports = VCRoomResource
