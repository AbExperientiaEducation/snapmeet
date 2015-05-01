const MGResource = require('./MGResource.es6')
const ResourceConstants = require('../../shared/constants/ResourceConstants.es6')

const UserResource = new MGResource({
  type: ResourceConstants.User.LABEL
  , recordProperties: {
    id: null
    , name: null
    , email: null
  }
})

module.exports = UserResource
