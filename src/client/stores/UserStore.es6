const MeetgunDispatcher = require('../dispatcher/MeetgunDispatcher.es6')
const UserResource = require('../utils/UserResource.es6')
const ResourceConstants = require('../../shared/constants/ResourceConstants.es6')
const MGResourceStore = require('../utils/MGResourceStore.es6')

const UserStore = new MGResourceStore({
  constants: ResourceConstants.User
  , ResourceAPI: UserResource
})

const _currentUserId = window.bootstrapData.userId

UserStore.currentUser = function(){
  return this.get(_currentUserId)
}

module.exports = UserStore
