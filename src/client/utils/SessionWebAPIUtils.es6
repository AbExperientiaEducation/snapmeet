const SessionServerActions = require('../actions/SessionServerActionCreators.es6')
const reqwest = require('reqwest')
const co = require('co')

module.exports = {

  signIn(data) {
    co(function* (){
      try {
        console.log("Attempting login with: " + data.email + " and " + data.password)
        const session = yield reqwest({
          url: '/login'
          , method: 'post'
          , data: {username: data.email, password: data.password}
        })
        console.log("Login suceeded")
        SessionServerActions.signInSucceeded(session)
      }
      catch (error) {
        console.error("Login failed: " + error.status + ' ' + error.response)
        SessionServerActions.signInFailed()
      }
    })
  }
  , signUp(data) {
    co(function* (){
      try {
        console.log("Attempting registration with: " + data.email + " and " + data.password)
        const session = yield reqwest({
          url: '/register'
          , method: 'post'
          , data: {username: data.email, password: data.password}
        })
        console.log(session)
        console.log("Registration suceeded")
        SessionServerActions.signUpSucceeded(session)
      }
      catch (error) {
        console.error("Registration failed: " + error.status + ' ' + error.response)
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