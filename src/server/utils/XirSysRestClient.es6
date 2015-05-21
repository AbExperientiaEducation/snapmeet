const rest = require('restler')
const co = require('co')
const ErrorLogger = require('../../shared/utils/ErrorLogger.es6')

let _restClient

const getCredentials = function() {
  return {
    ident: process.env.XIR_IDENT
    , secret: process.env.XIR_SECRET
    , domain: process.env.XIR_DOMAIN
    , application: process.env.XIR_APPLICATION
  }
}

const getHeaders = function() {
  return {
    "Content-Type": "application/json"
    , 'Accept':'*/*'
    , 'Accept-Encoding': 'gzip, deflate'
    , 'Accept-Language':'en-US,en;q=0.8'
  } 
}

const makeRequest = function(endpoint, data) {
  const rootPath = 'https://api.xirsys.com/'
  data = Object.assign(data, getCredentials())
  const args = {
    headers: getHeaders()
    , data: data
  }
  return new Promise(function(resolve, reject){
    const completeFn = function(data, response) {
      // parsed response body as js object
      // raw response
      resolve(JSON.parse(data))
    }

    const errFn = function(err){
      err.message = 'XirSys API Error: ' + err.message
      ErrorLogger.log(err, err.request)
      reject('XirSys API Error')
    }

    rest.post(rootPath + endpoint, args)
      .on('complete', completeFn)
      .on('error', errFn)
  })
}

const getServers = function(roomName) {
  const data = {
    secure: 1
    , room: roomName
  }

  return co(function* (){
    const result = yield makeRequest('getIceServers', data)
    return result.d
  })
}

const getWsServers = function() {
  const data = {}
  return co(function* (){
    const result = yield makeRequest('wsList', data)
    return result
  })
}

const getToken = function(roomName) {
  const data = {
    secure: 1
    , room: roomName
  }
  return co(function* (){
    const result = yield makeRequest('getToken', data)

    return result.d.token
  })
}

module.exports = {
  getServers: getServers
  , getWsServers: getWsServers
  , getToken: getToken
}
