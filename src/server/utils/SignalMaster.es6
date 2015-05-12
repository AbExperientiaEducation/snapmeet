// Based on https://github.com/andyet/signalmaster

const uuid = require('shortid')
const crypto = require('crypto')
const _ = require('lodash')

const safeCb = (cb) => {
  const cb = cb instanceof Function ? cb : () => {}
  return cb
}

const config = {
  "rooms": {
    "maxClients": 0 /* maximum number of clients per room. 0 = no limit */
  }
}

const setup = (client, _ioServer) => {

  const describeRoom = (name) => {
    const roomClients = _ioServer.sockets.adapter.rooms[name] || [] 
    const clients = Object.keys(roomClients).map(cid => {
      return _ioServer.sockets.connected[cid]
    })
    const result = { clients: {} }
    clients.forEach(function (client) {
      result.clients[client.id] = client.resources
    })
    return result
  }

  const clientsInRoom = (name) => {
    return _ioServer.sockets.clients(name).length
  }

  const removeFeed = (type) => {
    if (client.room) {
      _ioServer.sockets.in(client.room).emit('remove', {
        id: client.id,
        type: type
      })
      if (!type) {
        client.leave(client.room)
        client.room = undefined
      }
    }
  }

  const join = (name, cb) => {
    // sanity check
    if (typeof name !== 'string') return
    // check if maximum number of clients reached
    if (config.rooms && config.rooms.maxClients > 0 && 
      clientsInRoom(name) >= config.rooms.maxClients) {
        safeCb(cb)('full')
        return
    }
    // leave any existing rooms
    removeFeed()
    safeCb(cb)(null, describeRoom(name))
    client.join(name)
    client.room = name
  }

  const registerListeners = () => {
    // SETUP CLIENT LISTENERS
    client.resources = {
      screen: false,
      video: true,
      audio: false
    }

    // pass a message to another id
    client.on('message', function (details) {
      if (!details) return
      const otherClient = _.find(_ioServer.sockets.sockets, s => {return s.id == details.to})
      if (!otherClient) return
      details.from = client.id
      otherClient.emit('message', details)
    })

    client.on('shareScreen', () => {
      client.resources.screen = true
    })

    client.on('unshareScreen', (type) => {
      client.resources.screen = false
      removeFeed('screen')
    })

    client.on('join', join)

    // we don't want to pass "leave" directly because the
    // event type string of "socket end" gets passed too.
    client.on('disconnect', function () {
      removeFeed()
    })

    client.on('leave', function () {
      removeFeed()
    })

    client.on('create', function (name, cb) {
      if (arguments.length == 2) {
        cb = (typeof cb == 'function') ? cb : function () {}
        name = name || uuid()
      } else {
        cb = name
        name = uuid()
      }
      // check if exists
      if (_ioServer.sockets.clients(name).length) {
        safeCb(cb)('taken')
      } else {
        join(name)
        safeCb(cb)(null, name)
      }
    })

    // support for logging full webrtc traces to stdout
    // useful for large-scale error monitoring
    client.on('trace', function (data) {
      console.error('trace', JSON.stringify(
        [data.type, data.session, data.prefix, data.peer, data.time, data.value]
      ))
    })
  }

  registerListeners()
}

module.exports = {setup: setup}