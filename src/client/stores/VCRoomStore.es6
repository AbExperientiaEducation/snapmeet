const ResourceConstants = require('../../shared/constants/ResourceConstants.es6')
const VCRoomResource = require('../resources/VCRoomResource.es6')
const SMResourceStore = require('./SMResourceStore.es6')

const VCRoomStore = new SMResourceStore({
  constants: ResourceConstants.VCRoom
  , ResourceAPI: VCRoomResource
})

module.exports = VCRoomStore
