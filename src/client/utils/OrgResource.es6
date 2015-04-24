const MGResource = require('./MGResource.es6')
const ResourceConstants = require('../../shared/constants/ResourceConstants.es6')
const Actions = ResourceConstants.RestActions

const OrgResource = new MGResource({
  type: ResourceConstants.Org.LABEL
  , recordProperties: {
    displayName: 'default'
  }
})

module.exports = OrgResource
