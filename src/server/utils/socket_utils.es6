const livedb = require('livedb')
const sharejs = require('share')
const livedbMongo = require('livedb-mongo')
const richText = require('rich-text')
const Duplex = require('stream').Duplex
const sockjs = require('sockjs')

const mongoUrl = 'mongodb://127.0.0.1:27017/test'
livedb.ot.registerType(richText.type)

const createServer = function(){
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
  return sockServer
}

module.exports.createServer = createServer

