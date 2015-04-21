// Require our dependencies
const express = require('express')
const http = require('http')
const url = require('url')
const morgan = require('morgan')
const session = require('express-session')
const RedisStore = require('connect-redis')(session)
const passport = require('./middleware/passport.es6')
const bodyParser = require('body-parser')
const socketUtils = require('./utils/SockJSUtils.es6')
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
app.use(session({
  secret: 'keyboard cat',
  store: new RedisStore(redisOptions),
  resave: false,
  saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())

const server = require('http').Server(app)
server.listen(3000)

const sockServer = socketUtils.createServer()
sockServer.installHandlers(server, {prefix:'/democat'})

const socketIOServer = socketIOUtils.createServer(server)

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
      console.log(error.stack)
      res.status(500).json(error)
    }
  })
})

app.get('/', function (req, res) {
  res.render('./index.html')
})

MeetingEndpoints.register(socketIOServer)
TaskEndpoints.register(app)

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}
