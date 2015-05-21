const MeetgunDispatcher = require('../dispatcher/MeetgunDispatcher.es6')
const ResourceConstants = require('../../shared/constants/ResourceConstants.es6')
const ErrorLogger = require('../../shared/utils/ErrorLogger.es6')

module.exports = {
  receiveResources(groupedRawResources) {
    MeetgunDispatcher.dispatch({
      type: ResourceConstants.RECEIVE_RAW_EVENT
      , groupedRawResources: groupedRawResources
    })
  }

  , receiveBootstrapData() {
    ErrorLogger.init(window.bootstrapData.isProd)
    this.receiveResources(window.bootstrapData.resources)
  }
}