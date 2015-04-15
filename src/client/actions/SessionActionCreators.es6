const MeetgunDispatcher = require('../dispatcher/MeetgunDispatcher.es6')
const SessionConstants = require('../constants/SessionConstants.es6')
const SessionWebAPIUtils = require('../utils/SessionWebAPIUtils.es6')

const ActionTypes = SessionConstants.ActionTypes

module.exports = {

  signIn(data) {
    SessionWebAPIUtils.signIn(data)
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
    SessionWebAPIUtils.signUp(action.data)
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