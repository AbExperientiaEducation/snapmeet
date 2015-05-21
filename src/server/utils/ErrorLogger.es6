const rollbar = require('rollbar')
const _ = require('lodash')

// logError takes a string or error, plus optional bonus data.
// If bonus data is a request, Rollbar will do something smart with it.
module.exports.log = function(errorOrString, bonusData) {
  let error = errorOrString
  if(!(errorOrString instanceof Error)) {
    error = new Error(errorOrString)
  }
  console.error(error, error.stack)
  console.log('EXTRA ERROR DATA: ', bonusData)
  
  if(process.env.SNAPMEET_PRODUCTION) rollbar.handleError(error, bonusData)
}
