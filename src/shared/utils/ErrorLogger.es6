const rollbar = require('rollbar')
const _ = require('lodash')

let _isProduction = null

// logError takes a string or error, plus optional bonus data.
// If bonus data is a request, Rollbar will do something smart with it.
module.exports = {
  init(isProduction) {
    _isProduction = isProduction
  }
  
  , log(errorOrString, bonusData) {
    let error = errorOrString
    if(!(errorOrString instanceof Error)) {
      error = new Error(errorOrString)
    }
    console.error(error, error.stack)
    console.log('EXTRA ERROR DATA: ', bonusData)
    
    if(_isProduction) rollbar.handleError(error, bonusData)
  }
}