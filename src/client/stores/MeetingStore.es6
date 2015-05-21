const ResourceConstants = require('../../shared/constants/ResourceConstants.es6')
const MeetingResource = require('../resources/MeetingResource.es6')
const SMResourceStore = require('./SMResourceStore.es6')
const SnapmeetDispatcher = require('../dispatcher/SnapmeetDispatcher.es6')

const MeetingStore = new SMResourceStore({
  constants: ResourceConstants.Meeting
  , ResourceAPI: MeetingResource
  , createFn: (data) => {
    const localResource = MeetingResource.createNewRecord({orgId: data.orgId})
    setTimeout(() => {
      SnapmeetDispatcher.dispatch({
        type: ResourceConstants.Meeting.ActionTypes.LOCAL_RESOURCE_CREATED
        , id: localResource.id
      })
    }, 0)
  }
})

module.exports = MeetingStore
