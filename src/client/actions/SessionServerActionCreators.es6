const MeetgunDispatcher = require('../dispatcher/MeetgunDispatcher.es6')
const SessionConstants = require('../constants/SessionConstants.es6')

const ActionTypes = SessionConstants.ActionTypes

module.exports = {

  signInSucceeded(session) {
    MeetgunDispatcher.dispatch({
      type: ActionTypes.SIGN_IN_SUCCEEDED
      , session: session
    })
  }
  , signInFailed() {
    MeetgunDispatcher.dispatch({
      type: ActionTypes.SIGN_IN_FAILED
    })
  }
  , signUpSucceeded(session) {
    MeetgunDispatcher.dispatch({
      type: ActionTypes.SIGN_UP_SUCCEEDED
      , session: session
    })
  }
  , signUpFailed() {
    MeetgunDispatcher.dispatch({
      type: ActionTypes.SIGN_UP_FAILED
    })
  }
}
