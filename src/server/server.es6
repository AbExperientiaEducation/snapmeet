// Require our dependencies
const express = require('express')
const http = require('http')
const co = require('co')
const morgan = require('morgan')
var bodyParser = require('body-parser')
require('stackup')

// Create an express instance and set a port variable
const app = express()
const port = process.env.PORT || 3000

// Setup middleware
app.use(express.static(__dirname + '/../../public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(morgan('combined'))

app.set('views', __dirname + '/../../views')
app.engine('html', require('ejs').renderFile)

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
