const ResourceConstants = require('../../shared/constants/ResourceConstants.es6')
const MeetingResource = require('../resources/MeetingResource.es6')
const MGResourceStore = require('../utils/MGResourceStore.es6')

const MeetingStore = new MGResourceStore({
  constants: ResourceConstants.Meeting
  , ResourceAPI: MeetingResource
  , createFn: (data) => MeetingResource.createNewRecord({orgId: data.orgId})
})

module.exports = MeetingStore
