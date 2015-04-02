var passport = require('passport')
const BasicStrategy = require('passport-http').BasicStrategy
const co = require('co')
const DBUsers = require('../db/users.es6')

// Use the BasicStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, a username and password), and invoke a callback
//   with a user object.
passport.use(new BasicStrategy({
  },
  function(username, password, done) {
    co(function* (){
      console.log(username)
      const user = yield DBUsers.findOne(username)
      // var user = {name: 'Ben', password: 'whocares'}
      // var user = {}
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' })
      }
      // if (!user.validPassword(password)) {
      //   return done(null, false, { message: 'Incorrect password.' })
      // }
      return done(null, user)
    })
  })
)


module.exports = passport