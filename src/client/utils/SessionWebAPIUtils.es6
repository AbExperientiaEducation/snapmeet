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
}