const MeetgunDispatcher = require('../dispatcher/MeetgunDispatcher.es6')
const SessionConstants = require('../constants/SessionConstants.es6')

const ActionTypes = SessionConstants.ActionTypes

module.exports = {

  signInSucceeded() {
    MeetgunDispatcher.dispatch({
      type: ActionTypes.SIGN_IN_SUCCEEDED
    })
  }
  , signInFailed() {
    MeetgunDispatcher.dispatch({
      type: ActionTypes.SIGN_IN_FAILED
    })
  }
  , signUpSucceeded() {
    MeetgunDispatcher.dispatch({
      type: ActionTypes.SIGN_UP_SUCCEEDED
    })
  }
  , signUpFailed() {
    MeetgunDispatcher.dispatch({
      type: ActionTypes.SIGN_UP_FAILED
    })
  }

}