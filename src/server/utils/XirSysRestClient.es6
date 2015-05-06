const rest = require('restler')
const co = require('co')
let _restClient

const getCredentials = function() {
  return {
    ident: "abexed"
    , secret: '***REMOVED***'
    , domain: 'www.meetgun.com'
    , application: 'meetgun'    
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
      console.log('XirSys API Error', err.request.options)
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

module.exports = {
  getServers: getServers
}
