const neo4j = require('neo4j')
const cypherClient = require('../utils/cypher_client.es6')

const cypher = function(query) {
  return cypherClient(query).then(function(data) { 
    return data.map(function(x) { return x.target }) 
  })
}


module.exports.fetchAll = function(meetingId){  
  const query = { 
    query: 'MATCH (target:Task {meetingId: {meetingId}}) RETURN target'
    , params: {
        meetingId: meetingId
      }
  }
  return cypher(query)
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
  return cypher(createTaskQuery)
}

