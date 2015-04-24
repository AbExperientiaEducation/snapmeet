const co = require('co')
const neo4j = require('neo4j')
const cypher = require('../utils/cypher_client.es6')
const singleCypher = cypher.singleCypher
const recordsWithRels = cypher.recordsWithRels
const getWithRelations = function(taskId) {
  return recordsWithRels([taskId])
}

const create = function(taskInfo){
  const createTaskQuery = { 
    query: `MATCH (m:Meeting)
            WHERE m.id = {meetingId}
            CREATE (target:Task {taskProps})-[r:MEETING_TASK]->(m)
            RETURN target`
    , params: {
      taskProps: {
        createdTimestamp: taskInfo.createdTimestamp
        , id: taskInfo.id
        , meetingId: taskInfo.meetingId        
      }
      , meetingId: taskInfo.meetingId
    }
  }
  return co(function* (){
    try {
      const created = yield singleCypher(createTaskQuery, 'target')
      return yield getWithRelations(created.id)      
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
