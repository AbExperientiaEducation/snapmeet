// Require our dependencies
const express = require('express')
const http = require('http')
const url = require('url')
const co = require('co')
const morgan = require('morgan')
const session = require('express-session')
const RedisStore = require('connect-redis')(session)
const passport = require('./middleware/passport.es6')
const livedb = require('livedb')
const sharejs = require('share')
const livedbMongo = require('livedb-mongo')
const richText = require('rich-text')
const Duplex = require('stream').Duplex
const bodyParser = require('body-parser')
const sockjs = require('sockjs')
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

/* SOCK JS SERVER & SHARE JS
 */

const mongoUrl = 'mongodb://127.0.0.1:27017/test'
docStore = livedb.client(livedbMongo(mongoUrl + '?auto_reconnect', {
  safe: false
}))

const share = require('share').server.createClient({backend: docStore})
const cursorWatchers = {}

const setAsWatcher = function(docId, conn){
  if(!cursorWatchers[docId]) cursorWatchers[docId] = []
  cursorWatchers[docId].push(conn)
}

const notifyWatchers = function(docId, userId, cursorPos){
  cursorWatchers[docId].forEach(function(conn){
    conn.write(JSON.stringify({
      docId: docId
      , userId: userId
      , cursorPos: cursorPos
      , type: 'cursor-data'
    }))
  })
}

livedb.ot.registerType(richText.type)
sockServer = sockjs.createServer()
sockServer.on('connection', function(conn) {
  const stream = new Duplex({objectMode: true})
  stream.headers = conn.headers
  stream.remoteAddress = conn.remoteAddress

  stream._write = function (chunk, encoding, callback) {
    if (conn.state !== 'closed') {
      conn.write(JSON.stringify(chunk))
    }
    callback()
  }
  stream._read = function () {}
  stream.on('error', function (msg) { conn.close() })
 
  conn.on('data', function (data) {
    parsed = JSON.parse(data)
    switch(parsed.type) {
      case 'cursor-data':
        notifyWatchers(parsed.docId, parsed.userId, parsed.cursorPos)
        break
      case 'cursor-watch':
        setAsWatcher(parsed.docId, conn)
        break
      default:
        stream.push(data)
    }
  })
  conn.on('close', function (reason) {
    stream.emit('close')
    stream.emit('end')
    stream.end()
  })

  share.listen(stream)
})

sockServer.installHandlers(server, {prefix:'/democat'})
// END SOCK JS/SHAREJS


app.set('views', __dirname + '/../../views')
app.engine('html', require('ejs').renderFile)

app.post('/login', passport.authenticate('local'),
  function(req, res) {
    res.json({ id: req.user.id })
})

app.get('/register', function(req, res) {
  res.send('GET sent to register')
})

app.get('/', function (req, res) {
  res.render('./index.html')
})

const DBMeetings = require('./db/meetings.es6')
app.get('/api/meetings', function(req, res) {
  co(function* (){
    const meetings = yield DBMeetings.fetchAll() 
    res.json(meetings)
  })
})

app.post('/api/meetings/create', function(req, res){
  const meetingJson = req.body
  co(function* (){
    const meetingResponse = yield DBMeetings.create(meetingJson)
    res.json(meetingResponse[0])
  })
})

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}

app.listen(port)
