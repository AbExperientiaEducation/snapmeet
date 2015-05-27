const BootstrapData = require('./BootstrapData.es6')
const UserStore = require('../stores/UserStore.es6')

const setUserData = function() {
  const currentUser = UserStore.currentUser()

  if(currentUser) {
    mixpanel.people.set({
        "id": currentUser.id
        , "created": new Date(currentUser.createdTimestamp)
    })
    UserStore.removeChangeListener(setUserData)
  }
}

UserStore.addChangeListener(setUserData)

mixpanel.identify(BootstrapData.userId)
module.exports = {
  track(eventLabel, data) {
    if(BootstrapData.isProd) {
      if(!data) data = {}
      window.mixpanel.track(eventLabel, data)
    }    
  }
}
