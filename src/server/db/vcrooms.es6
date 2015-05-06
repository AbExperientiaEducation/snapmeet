const co = require('co')
const cypher = require('../utils/cypher_client.es6')
const singleCypher = cypher.singleCypher
const recordsWithRels = cypher.recordsWithRels
const Shortid = require('shortid')
const XirSysClient = require('../utils/XirSysRestClient.es6')

const getWithCredentials = function(id) {
  return co(function* (){
    const recordWithRels = yield recordsWithRels([id])
    const credentials = yield XirSysClient.getServers(id)
    const signalingToken = yield XirSysClient.getToken(id)
    credentials.signalingToken = signalingToken
    const record = recordWithRels.VCROOM[0]
    record.credentials = credentials
    return recordWithRels
  })
}

const create = function(meetingId){
  const query = { 
    query: `MATCH (m:Meeting)
            WHERE m.id = {meetingId}
            CREATE (target:VCRoom {vcRoomProps})-[r:MEETING_VCROOM]->(m)
            RETURN target`
    , params: {
      vcRoomProps: {
        createdTimestamp: Date.now()
        , id: Shortid.generate()
      }
      , meetingId: meetingId
    }
  }
  return singleCypher(query, 'target')
}

module.exports = {
  create: create
  , getWithCredentials: getWithCredentials
}
