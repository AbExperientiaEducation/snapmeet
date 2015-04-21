const neo4j = require('neo4j')
const cypherClient = require('../utils/cypher_client.es6')

const cypher = function(query) {
  return cypherClient(query).then(function(data) { 
    return data.map(function(x) { return x.task }) 
  })
}


module.exports.fetchAll = function(meetingId){  
  const query = { query: 'MATCH (task:Task {meetingId: {meetingId}}) RETURN task'
                  , params: {
                      meetingId: meetingId
                    }
                }
  return cypher(query)
}

module.exports.create = function(taskInfo){
  console.log("creating", taskInfo)
  const query = { query: 'CREATE (task:Task {createdTimestamp:{createdTimestamp}, id:{id}, meetingId:{meetingId}}) RETURN task'
                  , params: {
                      createdTimestamp: taskInfo.createdTimestamp
                      , id: taskInfo.id
                      , meetingId: taskInfo.meetingId
                    }
                }
  return cypher(query)
}

