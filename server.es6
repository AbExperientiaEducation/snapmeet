// Require our dependencies
const express = require('express')
const http = require('http')
const Q = require('q')
const morgan = require('morgan')

// Create an express instance and set a port variable
const app = express()
const port = process.env.PORT || 3000
app.use(express.static(__dirname + '/public'))
app.use(morgan('combined'))
app.set('views', __dirname + '/views')
app.engine('html', require('ejs').renderFile)

app.get('/', function (req, res) {
  res.render('./index.html')
})

const DBMeetings = require('./src/server/db/meetings.es6')
app.get('/api/meetings', function(req, res) {
  Q.spawn(function* (){
    const meetings = yield DBMeetings.fetchAll()
    res.json(meetings)
  })
})

app.post('/api/meetings/create', function(req, res){
  const timestamp = req.params.timestamp
  Q.spawn(function* (){
    const meeting = yield DBMeetings.create({timestamp: timestamp}) 
    res.json(meeting)
  })
})

app.listen(port)
