const SMResource = require('./SMResource.es6')
const ResourceConstants = require('../../shared/constants/ResourceConstants.es6')

const UserResource = new SMResource({
  type: ResourceConstants.User.LABEL
  , recordProperties: {
    id: null
    , name: null
    , email: null
  }
})

UserResource.associateToCurrentUser = function(data){
  this.makeRestCall(ResourceConstants.OtherActions.ASSOCIATE_TO_USER, data)
}

module.exports = UserResource
