const MeetgunDispatcher = require('../dispatcher/MeetgunDispatcher.es6')
const SessionConstants = require('../constants/SessionConstants.es6')
const SessionWebAPIUtils = require('../utils/SessionWebAPIUtils.es6')

const ActionTypes = SessionConstants.ActionTypes

module.exports = {

  signIn(data) {
    SessionWebAPIUtils.signIn(data)
  }
  , signUp(data) {
    SessionWebAPIUtils.signUp(data)
  }
  , notifyMe(data) {
    SessionWebAPIUtils.notifyMe(data)
  }

}