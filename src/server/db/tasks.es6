const neo4j = require('neo4j')
const cypher = require('../utils/cypher_client.es6')
const multiCypher = cypher.multiCypher
const recordsWithRels = cypher.recordsWithRels

module.exports = {
  create(taskInfo){
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
    return multiCypher(createTaskQuery)
  }

  , getWithRelations(taskId) {
    return recordsWithRels([taskId])
  }

}
