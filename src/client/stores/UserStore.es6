const SnapmeetDispatcher = require('../dispatcher/SnapmeetDispatcher.es6')
const UserResource = require('../resources/UserResource.es6')
const ResourceConstants = require('../../shared/constants/ResourceConstants.es6')
const SMResourceStore = require('./SMResourceStore.es6')
const BootstrapData = require('../utils/BootstrapData.es6')

const customEventHandler = function(action) {
  if(action.type === ResourceConstants.OtherActions.ASSOCIATE_TO_USER) {
    this.ResourceAPI.associateToCurrentUser(action)
    return true
  }
  return false
}

const UserStore = new SMResourceStore({
  constants: ResourceConstants.User
  , ResourceAPI: UserResource
  , eventHandler: customEventHandler
})

const _currentUserId = BootstrapData.userId

UserStore.currentUser = function(){
  return this.get(_currentUserId)
}

module.exports = UserStore
