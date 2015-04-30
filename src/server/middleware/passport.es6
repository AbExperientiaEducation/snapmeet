const passport = require('passport')
const BasicStrategy = require('passport-http').BasicStrategy
const LocalStrategy = require('passport-local').Strategy
const co = require('co')
const DBUsers = require('../db/users.es6')


passport.deserializeUser(function(id, done) {
  const errorHandler = function(err){done(err)}
  const successHandler = function(result){done(null, result)}
  const user = DBUsers.findById(id)
  user.then(successHandler, errorHandler)
})

passport.serializeUser(function(user, done) {
  done(null, user.id)
})

passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
  },
  function(username, password, done) {
    co(function* (){
      const user = yield DBUsers.findOne(username)
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' })
      }
      if (user.password && !DBUsers.validPassword(user, password)) {
        return done(null, false, { message: 'Incorrect password.' })
      }
      return done(null, user)
    }).catch(function(err){console.error("Error on co in passport: " + err)})
  })
)

module.exports = passport