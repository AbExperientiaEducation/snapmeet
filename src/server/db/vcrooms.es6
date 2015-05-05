const co = require('co')
const cypher = require('../utils/cypher_client.es6')
const singleCypher = cypher.singleCypher
const recordsWithRels = cypher.recordsWithRels
const Shortid = require('shortid')

const getWithRelations = function(ids) {
  return recordsWithRels(ids)
}

const runQueryAndReturnNodeRelations = function(query) {
  return co(function* (){
    try {
      const modified = yield singleCypher(query, 'target')
      return yield getWithRelations([modified.id])
    }
    catch(err) {
      console.error(err.stack)
    }
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
        , ready: false
      }
      , meetingId: meetingId
    }
  }
  return singleCypher(query, 'target')
}

const update = function(vcRoomInfo) {
  const query = {
    query: `MATCH (target:VCRoom)
            WHERE target.id = '${vcRoomInfo.id}'
            SET target = {vcRoomProps}
            RETURN target`
    , params: {
      vcRoomProps: vcRoomInfo
    }
  }
  return runQueryAndReturnNodeRelations(query)
}


module.exports = {
  create: create
  , update: update
}
