const SMResource = require('./SMResource.es6')
const ResourceConstants = require('../../shared/constants/ResourceConstants.es6')

const MeetingResource = new SMResource({
  type: ResourceConstants.Meeting.LABEL
  , recordProperties: {}
})

module.exports = MeetingResource
