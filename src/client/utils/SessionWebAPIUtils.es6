const SessionActions = require('../actions/SessionActionCreators.es6')
var reqwest = require('reqwest')
var co = require('co')

module.exports = {

  signIn: (data) => {
    co(function* (){
      try {
        console.log("Attempting login with: " + data.email + " and " + data.password)
        const session = yield reqwest({
          url: '/login'
          , method: 'post'
          , data: {username: data.email, password: data.password}
        })
        console.log("Login suceeded")
        SessionActions.signInSucceeded()
      }
      catch (error) {
        console.log("Login failed: " + error.status + ' ' + error.response)
        SessionActions.signInFailed()
      }
    })
  }
  , signUp: (data) => {
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
        SessionActions.signUpSucceeded()
      }
      catch (error) {
        console.log("Registration failed: " + error.status + ' ' + error.response)
        SessionActions.signUpFailed()
      }
    })
  }
}