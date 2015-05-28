const SnapmeetDispatcher = require('../dispatcher/SnapmeetDispatcher.es6')
const ResourceConstants = require('../../shared/constants/ResourceConstants.es6')
const BootstrapData = require('../utils/BootstrapData.es6')

module.exports = {
  receiveResources(groupedRawResources) {
    SnapmeetDispatcher.dispatch({
      type: ResourceConstants.RECEIVE_RAW_EVENT
      , groupedRawResources: groupedRawResources
    })
  }

  , receiveBootstrapData() {
    this.receiveResources(BootstrapData.resources)
  }
}