const BootstrapData = require('./BootstrapData.es6')

mixpanel.identify(BootstrapData.userId)
module.exports = {
  track(eventLabel, data) {
    if(BootstrapData.isProd) {
      if(!data) data = {}
      window.mixpanel.track(eventLabel, data)
    }    
  }
}
