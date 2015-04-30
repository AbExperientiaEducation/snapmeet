const co = require('co')
const neo4j = require('neo4j')
const Cypher = require('../utils/cypher_client.es6')
const multiCypher = Cypher.multiCypher
const singleCypher = Cypher.singleCypher
const recordsWithRels = Cypher.recordsWithRels

const getWithRelations = function(ids) {
  return recordsWithRels(ids)
}

const create = function(meetingInfo){
  const query = { 
    query: `MATCH (o:User)
            WHERE o.id = {userId}
            CREATE (target:Meeting {meetingProps})-[r:USER_MEETING]->(o)
            RETURN target`
    , params: {
      userId: meetingInfo.userId
      , meetingProps: {
        createdTimestamp: meetingInfo.createdTimestamp
        , id: meetingInfo.id        
      }
    }
  }

  return co(function* (){
    try {
      const created = yield singleCypher(query, 'target')
      return yield getWithRelations([created.id])
    }
    catch(err) {
      console.error(err.stack)
    }
  })    

  return multiCypher(query)
}


module.exports = {
  create: create
  , getWithRelations: getWithRelations
}