const MeetgunDispatcher = require('../dispatcher/MeetgunDispatcher.es6')
const SessionConstants = require('../constants/SessionConstants.es6')

const ActionTypes = SessionConstants.ActionTypes

module.exports = {

  signIn(data) {
    MeetgunDispatcher.dispatch({
      type: ActionTypes.SIGN_IN
      , data: data
    })
  }
  , signInSucceeded() {
    MeetgunDispatcher.dispatch({
      type: ActionTypes.SIGN_IN_SUCCEEDED
    })
  }
  , signInFailed() {
    MeetgunDispatcher.dispatch({
      type: ActionTypes.SIGN_IN_FAILED
    })
  }
  , signUp(data) {
    MeetgunDispatcher.dispatch({
      type: ActionTypes.SIGN_UP
      , data: data
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