const MeetgunDispatcher = require('../dispatcher/MeetgunDispatcher.es6')
const ResourceConstants = require('../constants/ResourceConstants.es6')
const ActionTypes = ResourceConstants.ActionTypes
module.exports = {
  receiveAll(resourceType, rawResources) {
    MeetgunDispatcher.dispatch({
      type: ActionTypes[resourceType].RECEIVE_RAW
      , rawResources: rawResources
    })
  }

  , receiveCreated(resourceType, rawCreatedResource) {
    MeetgunDispatcher.dispatch({
      type: ActionTypes[resourceType].RECEIVE_RAW
      , rawResources: [rawCreatedResource]
    })
  }
}