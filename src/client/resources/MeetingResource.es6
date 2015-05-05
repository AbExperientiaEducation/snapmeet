const MGResource = require('./MGResource.es6')
const ResourceConstants = require('../../shared/constants/ResourceConstants.es6')

const MeetingResource = new MGResource({
  type: ResourceConstants.Meeting.LABEL
  , recordProperties: {}
})

module.exports = MeetingResource
