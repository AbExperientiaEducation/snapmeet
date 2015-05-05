const ResourceConstants = require('../../shared/constants/ResourceConstants.es6')
const VCRoomResource = require('../resources/VCRoomResource.es6')
const MGResourceStore = require('./MGResourceStore.es6')

const VCRoomStore = new MGResourceStore({
  constants: ResourceConstants.VCRoom
  , ResourceAPI: VCRoomResource
})

module.exports = VCRoomStore
