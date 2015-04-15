var passport = require('passport')
const BasicStrategy = require('passport-http').BasicStrategy
const LocalStrategy = require('passport-local').Strategy
const co = require('co')
const DBUsers = require('../db/users.es6')


passport.deserializeUser(function(id, done) {
  errorHandler = function(err){done(err)}
  successHandler = function(result){done(null, result)}
  user = DBUsers.findById(id)
  user.then(successHandler, errorHandler)
})

passport.serializeUser(function(user, done) {
  done(null, user.id)
})

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(username, password, done) {
    co(function* (){
      const user = yield DBUsers.findOne(username)
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' })
      }
      if (!DBUsers.validPassword(user, password)) {
        return done(null, false, { message: 'Incorrect password.' })
      }
      return done(null, user)
    }).catch(function(err){console.log("Error on co in passport: " + err)})
  })
)

module.exports = passport