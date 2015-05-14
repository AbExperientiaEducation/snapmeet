const ResourceConstants = require('../../shared/constants/ResourceConstants.es6')
const MeetingResource = require('../resources/MeetingResource.es6')
const MGResourceStore = require('./MGResourceStore.es6')
const MeetgunDispatcher = require('../dispatcher/MeetgunDispatcher.es6')

const MeetingStore = new MGResourceStore({
  constants: ResourceConstants.Meeting
  , ResourceAPI: MeetingResource
  , createFn: (data) => {
    const localResource = MeetingResource.createNewRecord({orgId: data.orgId})
    setTimeout(() => {
      MeetgunDispatcher.dispatch({
        type: ResourceConstants.Meeting.ActionTypes.LOCAL_RESOURCE_CREATED
        , id: localResource.id
      })
    }, 0)
  }
})

module.exports = MeetingStore
