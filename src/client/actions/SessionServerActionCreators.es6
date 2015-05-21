const SnapmeetDispatcher = require('../dispatcher/SnapmeetDispatcher.es6')
const SessionConstants = require('../constants/SessionConstants.es6')

const ActionTypes = SessionConstants.ActionTypes

module.exports = {

  signInSucceeded(session) {
    SnapmeetDispatcher.dispatch({
      type: ActionTypes.SIGN_IN_SUCCEEDED
      , session: session
    })
  }
  , signInFailed() {
    SnapmeetDispatcher.dispatch({
      type: ActionTypes.SIGN_IN_FAILED
    })
  }
  , signUpSucceeded(session) {
    SnapmeetDispatcher.dispatch({
      type: ActionTypes.SIGN_UP_SUCCEEDED
      , session: session
    })
  }
  , signUpFailed() {
    SnapmeetDispatcher.dispatch({
      type: ActionTypes.SIGN_UP_FAILED
    })
  }
}
