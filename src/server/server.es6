// Require our dependencies
const express = require('express')
const http = require('http')
const url = require('url')
const morgan = require('morgan')
const session = require('express-session')
const RedisStore = require('connect-redis')(session)
const passport = require('./middleware/passport.es6')
const cookieParser = require('cookie-parser')
const passportSocketIo = require("passport.socketio")
const co = require('co')
const bodyParser = require('body-parser')
const syncDocHandling = require('./utils/SyncDocHandling.es6')
const socketIOUtils = require('./utils/SocketIOUtils.es6')
const MeetingEndpoints = require('./endpoints/MeetingEndpoints.es6')
const TaskEndpoints = require('./endpoints/TaskEndpoints.es6')

require('stackup')

// Create an express instance and set a port variable
const app = express()
const port = process.env.PORT || 3000

// Setup middleware
app.use(express.static(__dirname + '/../../public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(morgan('combined'))

const redisOptions = {host: '127.0.0.1', port: '6379'}

const unsafeSecret = 'keyboard cat hall and oates remix'
const sessionStore = new RedisStore(redisOptions)
app.use(session({
  secret: unsafeSecret,
  store: sessionStore,
  resave: false,
  saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())

const server = require('http').Server(app)
server.listen(3000)

const socketIOServer = socketIOUtils.createServer(server)
socketIOServer.use(passportSocketIo.authorize({
  cookieParser: cookieParser
  , key: 'connect.sid'
  , secret: unsafeSecret
  , store: sessionStore
  , success: function(data, accept){console.log('success'); accept()}
  , fail: function(data, message, error, accept){console.log('socket session error', message, error.stack)}
}))

syncDocHandling.init(socketIOServer)

app.set('views', __dirname + '/../../views')
app.engine('html', require('ejs').renderFile)

app.post('/login', passport.authenticate('local'),
  function(req, res) {
    res.json({ user: req.user })
})

const DBUsers = require('./db/users.es6')
app.post('/register', function(req, res) {
  const registration = req.body
  console.log("Attempting registration")
  co(function* (){
    try {
      const registrationResult = yield DBUsers.register(registration.username, registration.password)
      req.login({id: registrationResult.id, username: registrationResult.email},
                  function(err){})
      res.status(200).json({user: req.user})
    } catch(error) {
      console.error(error.stack)
      res.status(500).json(error)
    }
  })
})

app.get('/', function (req, res) {
  co(function* (){
    try {
      let userId
      if(req.session.passport.user) {
        userId = req.session.passport.user
      } else {
        // Create a new anonymous user
        const user = yield DBUsers.registerAnonymous()
        userId = user.id
      }
      const userWithRels = yield DBUsers.getWithRelations(userId)
      req.login({id: userId}, function(err){if(err)console.error(err.stack)})
      res.render('./index.html', {bootstrapData: {userId: userId, resources: userWithRels}})
    }
    catch(err) {
      console.error(err.stack)
      res.status(500).json(error)
    }    
  })
})

MeetingEndpoints.register()
TaskEndpoints.register()

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}
