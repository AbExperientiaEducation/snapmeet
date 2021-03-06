const livedb = require('livedb')
const sharejs = require('share')
const livedbMongo = require('livedb-mongo')
const richText = require('rich-text')
const TextType = require('ot-text')
const Duplex = require('stream').Duplex
const SocketEventConstants = require('../../shared/constants/SocketEventConstants.es6')

let _client = null

module.exports.getClient = function(){
  return _client
}

module.exports.init = function(socketIOServer){
  livedb.ot.registerType(richText.type)
  livedb.ot.registerType(TextType.type)
  const docStore = livedb.client(livedbMongo(process.env.MONGO_URL + '?auto_reconnect', {
    safe: false
  }))

  _client = sharejs.server.createClient({backend: docStore})

  socketIOServer.on('connect', function(socket) {
    let stream = null
    let agent = null
    const cleanup = function() {
      socket.removeAllListeners()
      if(stream) {
        stream.emit('close')
        stream.emit('end')
        stream.end()        
      }
      if(agent) {
        agent.session._cleanup()        
      }
      
    }
    socket.on('disconnect', cleanup)
    socket.on('close', cleanup)

    socket.on(SocketEventConstants.SHARE_JS_READY, function(){
      stream = new Duplex({objectMode: true})
      stream.headers = socket.request.headers
      stream.remoteAddress = socket.remoteAddress

      stream._write = function (chunk, encoding, callback) {
        if (socket.readyState !== 'closed') {
          socket.emit(SocketEventConstants.SHARE_JS_DATA, JSON.stringify(chunk))
        }
        callback()
      }
      stream._read = function () {}
      stream.on('error', function (msg) { socket.transport.close() })
      socket.on(SocketEventConstants.SHARE_JS_DATA, function (data) {
        const parsed = JSON.parse(data)
        stream.push(data)
      })

      socket.on(SocketEventConstants.CURSOR_DATA, function(data) {
        socketIOServer.to(data.docId).emit(SocketEventConstants.CURSOR_DATA, data)
      })

      // Cursor subscribe/unsubscribe call through to join/leave. 
      // they take one arg (docId), which ends up being the name of the room.
      socket.on(SocketEventConstants.CURSOR_SUBSCRIBE, socket.join)
      socket.on(SocketEventConstants.CURSOR_UNSUBSCRIBE, socket.leave)

      socket.on('close', function (reason) {

      })

      agent = _client.listen(stream)
    })
  })
  return socketIOServer
}
