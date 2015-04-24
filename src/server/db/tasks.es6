const co = require('co')
const cypher = require('../utils/cypher_client.es6')
const singleCypher = cypher.singleCypher
const recordsWithRels = cypher.recordsWithRels

const getWithRelations = function(ids) {
  return recordsWithRels(ids)
}

const create = function(taskInfo){
  const query = { 
    query: `MATCH (m:Meeting)
            WHERE m.id = {meetingId}
            CREATE (target:Task {taskProps})-[r:MEETING_TASK]->(m)
            RETURN target`
    , params: {
      taskProps: {
        createdTimestamp: taskInfo.createdTimestamp
        , id: taskInfo.id
      }
      , meetingId: taskInfo.meetingId
    }
  }
  
  return co(function* (){
    try {
      const created = yield singleCypher(query, 'target')
      return yield getWithRelations([created.id])
    }
    catch(err) {
      console.log(err.stack)
    }
  })    
}


module.exports = {
  create: create
  , getWithRelations: getWithRelations
}
