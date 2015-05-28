// Require our dependencies
require('dotenv').load()
require('newrelic')
const express = require('express')
const http = require('http')
const url = require('url')
const morgan = require('morgan')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session);
const passport = require('./middleware/passport.es6')
const cookieParser = require('cookie-parser')
const passportSocketIo = require("passport.socketio")
const co = require('co')
const bodyParser = require('body-parser')
const syncDocHandling = require('./utils/SyncDocHandling.es6')
const socketIOUtils = require('./utils/SocketIOUtils.es6')
const MeetingEndpoints = require('./endpoints/MeetingEndpoints.es6')
const TaskEndpoints = require('./endpoints/TaskEndpoints.es6')
const UserEndpoints = require('./endpoints/UserEndpoints.es6')
const VCRoomEndpoints = require('./endpoints/VCRoomEndpoints.es6')
const InterestDB = require('./db/interest.es6')
const rollbar = require('rollbar')
const ErrorLogger = require('../shared/utils/ErrorLogger.es6')
require('stackup')

ErrorLogger.init(!!process.env.SNAPMEET_PRODUCTION, true)

// Create an express instance and set a port variable
const app = express()
const port = process.env.PORT || 3000

// Setup middleware
app.use(rollbar.errorHandler('***REMOVED***'))
app.use(express.static(__dirname + '/../../public', {maxAge: '1y'}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(morgan('combined'))

const sessionStore = new MongoStore({url:process.env.MONGO_URL})
app.use(session({
  secret: process.env.SESSION_SECRET,
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
  , secret: process.env.SESSION_SECRET
  , store: sessionStore
  , success: function(data, accept){accept()}
  , fail: function(data, message, error, accept){
    error.message = 'Socket Session Error: ' + error.message
    ErrorLogger.log(error, message)
  }
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
  co(function* (){
    try {
      const registrationResult = yield DBUsers.register(registration.username, registration.password)
      req.login({id: registrationResult.id, username: registrationResult.email},
                  function(err){})
      res.status(200).json({user: req.user})
    } catch(error) {
      ErrorLogger.log(error)
      res.status(500).json(error)
    }
  })
})

app.post('/interest', function(req, res) {
  const registration = req.body
  InterestDB.create(registration)    
})

const mainAppRoute = function (req, res) {
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
      req.login({id: userId}, function(err){ if(err) ErrorLogger.log(err) })
      res.render('./built/index.html', {bootstrapData: {isProd: process.env.SNAPMEET_PRODUCTION, userId: userId, resources: userWithRels}})
    }
    catch(err) {
      ErrorLogger.log(err)
      res.status(500).json(error)
    }    
  })
}

app.get('/', mainAppRoute)
app.get('/meetings/*', mainAppRoute)

MeetingEndpoints.register()
TaskEndpoints.register()
UserEndpoints.register()
VCRoomEndpoints.register()

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}
