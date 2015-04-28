const ResourceConstants = require('../../shared/constants/ResourceConstants.es6')
const MeetingResource = require('../utils/MeetingResource.es6')
const MGResourceStore = require('../utils/MGResourceStore.es6')

const MeetingStore = new MGResourceStore({
  type: ResourceConstants.Meeting.LABEL
  , ResourceAPI: MeetingResource
  , restActions: ResourceConstants.Meeting.ActionTypes
  , createFn: (data) => MeetingResource.createNewRecord({orgId: data.orgId})
})

module.exports = MeetingStore
