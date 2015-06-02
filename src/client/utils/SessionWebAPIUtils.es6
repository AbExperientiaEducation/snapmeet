const SessionServerActions = require('../actions/SessionServerActionCreators.es6')
const reqwest = require('reqwest')
const co = require('co')

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
        SessionServerActions.signInFailed()
        throw(error)
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
        SessionServerActions.signUpFailed()
        throw(error)
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