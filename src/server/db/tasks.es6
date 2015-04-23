const neo4j = require('neo4j')
const multiCypher = require('../utils/cypher_client.es6').multiCypher

module.exports.fetchAll = function(meetingId){  
  const query = { 
    query: 'MATCH (target:Task {meetingId: {meetingId}}) RETURN target'
    , params: {
        meetingId: meetingId
      }
  }
  return multiCypher(query)
}

module.exports.create = function(taskInfo){
  const createTaskQuery = { 
    query: `MATCH (m:Meeting)
            WHERE m.id = {meetingId}
            CREATE (target:Task {taskProps})-[:MEETING_TASK]->(m)
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

