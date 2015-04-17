const MGResource = require('./MGResource.es6')
const ResourceConstants = require('../constants/ResourceConstants.es6')
const MeetingUtils = require('../../shared/utils/MeetingUtils.es6')

const MeetingResource = new MGResource({
  resourcePath: '/meetings'
  , serializer: MeetingUtils.jsonifyMeeting
  , type: ResourceConstants.ResourceTypes.MEETING
})

module.exports = MeetingResource
