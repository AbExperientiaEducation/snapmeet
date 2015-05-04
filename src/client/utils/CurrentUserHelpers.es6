const UserStore = require('../stores/UserStore.es6')
const RelationStore = require('../stores/RelationStore.es6')
const MeetingStore = require('../stores/MeetingStore.es6')

module.exports = {
  userMeetings() {
    const user = UserStore.currentUser()
    const userId = user ? user.id : null
    return MeetingStore.getResourcesFromRelation(userId, 'USER_MEETING')
  }

  , userMeetingIds() {
    const user = UserStore.currentUser()
    const userRelations = RelationStore.getRelations(user.id)
    return userRelations.USER_MEETING || []
  }
}
