const MeetgunDispatcher = require('../dispatcher/MeetgunDispatcher.es6')
const SessionConstants = require('../constants/SessionConstants.es6')

const ActionTypes = SessionConstants.ActionTypes

module.exports = {

  signIn: function(data) {
    MeetgunDispatcher.dispatch({
      // Not sure what the action creator for this should be?
      type: ActionTypes.SIGN_IN
      , data: data
    })
  }

}