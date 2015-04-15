const MeetgunDispatcher = require('../dispatcher/MeetgunDispatcher.es6')
const SessionConstants = require('../constants/SessionConstants.es6')

const ActionTypes = SessionConstants.ActionTypes

module.exports = {

  signIn: function(data) {
    MeetgunDispatcher.dispatch({
      type: ActionTypes.SIGN_IN
      , data: data
    })
  }
  , signInSucceeded: function() {
    MeetgunDispatcher.dispatch({
      type: ActionTypes.SIGN_IN_SUCCEEDED
    })
  }
  , signInFailed: function() {
    MeetgunDispatcher.dispatch({
      type: ActionTypes.SIGN_IN_FAILED
    })
  }

}