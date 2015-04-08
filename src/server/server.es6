// Require our dependencies
const express = require('express')
const http = require('http')
const url = require('url')
const co = require('co')
const morgan = require('morgan')
const session = require('express-session')
const RedisStore = require('connect-redis')(session)
var bodyParser = require('body-parser')
const passport = require('./middleware/passport.es6')
require('stackup')

// Create an express instance and set a port variable
const app = express()
const port = process.env.PORT || 3000

// Setup middleware
app.use(express.static(__dirname + '/../../public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(morgan('combined'))
var redisOptions = {host: '127.0.0.1', port: '6379'}
app.use(session({
  secret: 'keyboard cat',
  store: new RedisStore(redisOptions),
  resave: false,
  saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())

app.set('views', __dirname + '/../../views')
app.engine('html', require('ejs').renderFile)

// app.post('/login',function(req, res, next) {
//   passport.authenticate('local', function(err, user, info) {
//     console.log(err, info, user, req)
//     if (err) { return next(err); }
//     if (!user) { return res.redirect('/login'); }
//     req.logIn(user, function(err) {
//       if (err) { return next(err); }
//       return res.redirect('/users/' + user.username);
//     });
//   })(req, res, next)
//   // passport.authenticate('local'), 
//   // function(req, res){
//   //   console.log(req)
//   // }
// })

app.post('/login',
          passport.authenticate('local', {  successRedirect: '/',
                                            failureRedirect: '/register'
                                          }
          )
)

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

app.listen(port)
