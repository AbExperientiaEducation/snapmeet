const rollbar = require('rollbar')
const _ = require('lodash')

let _isProduction = null
let _logToConsole = null

// logError takes a string or error, plus optional bonus data.
// If bonus data is a request, Rollbar will do something smart with it.
module.exports = {
  init(isProduction, logToConsole) {
    _isProduction = isProduction
    _logToConsole = logToConsole
  }
  
  , log(errorOrString, bonusData) {
    let error = errorOrString
    if(!(errorOrString instanceof Error)) {
      error = new Error(errorOrString)
    }

    if(_logToConsole) {
      console.error(error, error.stack)
      console.log('EXTRA ERROR DATA: ', bonusData)      
    }
    
    if(_isProduction) rollbar.handleError(error, bonusData)

  }
}