const ResourceConstants = require('../../shared/constants/ResourceConstants.es6')
const OrgResource = require('../utils/OrgResource.es6')
const MGResourceStore = require('../utils/MGResourceStore.es6')

const OrgStore = new MGResourceStore({
  type: ResourceConstants.Org.LABEL
  , ResourceAPI: OrgResource
  , createAction: ResourceConstants.Org.ActionTypes.CREATE
  , createFn: (data) => OrgResource.createNewRecord({displayName: data.displayName})
})

module.exports = OrgStore
