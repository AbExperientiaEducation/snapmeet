const SessionServerActions = require('../actions/SessionServerActionCreators.es6')
const reqwest = require('reqwest')
const co = require('co')
const ErrorLogger = require('../../shared/utils/ErrorLogger.es6')

module.exports = {

  signIn(data) {
    co(function* (){
      try {
        // console.log("Attempting login with: " + data.email + " and " + data.password)
        const session = yield reqwest({
          url: '/login'
          , method: 'post'
          , data: {username: data.email, password: data.password}
        })
        SessionServerActions.signInSucceeded(session)
      }
      catch (error) {
        error.message = "Login failed: " + error.message
        ErrorLogger.log(error, error.response)
        SessionServerActions.signInFailed()
      }
    })
  }
  , signUp(data) {
    co(function* (){
      try {
        // console.log("Attempting registration with: " + data.email + " and " + data.password)
        const session = yield reqwest({
          url: '/register'
          , method: 'post'
          , data: {username: data.email, password: data.password}
        })
        SessionServerActions.signUpSucceeded(session)
      }
      catch (error) {
        error.message = "Registration failed: " + error.message
        ErrorLogger.log(error, error.response)
        SessionServerActions.signUpFailed()
      }
    })
  }
  , notifyMe(data) {
    reqwest({
      url: '/interest'
      , method: 'post'
      , data: {email: data.email, type: 'interest'}
    })

  }
}