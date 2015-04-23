const neo4j = require('neo4j')
const cypherClient = require('../utils/cypher_client.es6')

const cypher = function(query) {
  return cypherClient(query).then(function(data) { 
    return data.map(function(x) { 
      return x.target 
    }) 
  })
}


module.exports = {
  fetchAll(){  
    return cypher({ query: 'MATCH (target:Meeting) RETURN target'})
  }

  , create(meetingInfo){
    const query = { query: 'CREATE (target:Meeting {createdTimestamp:{createdTimestamp}, id:{id}}) RETURN target',
                    params: {
                      createdTimestamp: meetingInfo.createdTimestamp
                      , id: meetingInfo.id
                    }
                  }
    return cypher(query)
  }

  , getWithRelations(meetingId) {
    
    const query = { 
      query:`MATCH (target) 
             WHERE target.id={meetingId}
             OR (target)--({id:{meetingId} }) 
             RETURN target`
      , params: {meetingId: meetingId}
    }
    return cypher(query)

  }

}

