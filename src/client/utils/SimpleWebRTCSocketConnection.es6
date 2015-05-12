const SimpleWebRTCConnection = function(connection) {
  this.connection = connection
}

SimpleWebRTCConnection.prototype.on = function (ev, fn) {
  this.connection.on(ev, fn)
}

SimpleWebRTCConnection.prototype.emit = function () {
  this.connection.emit.apply(this.connection, arguments)
}

SimpleWebRTCConnection.prototype.getSessionid = function () {
  return this.connection.id
}

SimpleWebRTCConnection.prototype.disconnect = function () {
  return this.connection.disconnect()
}

SimpleWebRTCConnection.prototype.removeListener = function(n, f) {
  return this.connection.removeListener(n, f)
}

const wrapConnection = function(connection){
  return new SimpleWebRTCConnection(connection)
}

module.exports = wrapConnection
