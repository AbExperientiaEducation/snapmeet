mixpanel.identify(window.bootstrapData.userId)
module.exports = {
  track(eventLabel, data) {
    if(window.bootstrapData.isProd) {
      if(!data) data = {}
      window.mixpanel.track(eventLabel, data)
    }    
  }
}
