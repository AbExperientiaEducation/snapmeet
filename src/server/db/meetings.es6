const neo4j = require('neo4j')
const cypherClient = require('../utils/cypher_client.es6')

const cypher = function(query) {
  return cypherClient(query).then(function(data) { 
    return data.map(function(x) { return x.meeting }) 
  })
}


module.exports.fetchAll = function(){  
  return cypher({ query: 'MATCH (meeting:Meeting) RETURN meeting'})
}

module.exports.create = function(meetingInfo){
  const query = { query: 'CREATE (meeting:Meeting {createdTimestamp:{createdTimestamp}, id:{id}}) RETURN meeting',
                  params: {
                    createdTimestamp: meetingInfo.createdTimestamp
                    , id: meetingInfo.id
                  }
                }
  return cypher(query)
}

