const neo4j = require('neo4j')
const multiCypher = require('../utils/cypher_client.es6').multiCypher

module.exports = {
  fetchAll(){  
    return multiCypher({ query: 'MATCH (target:Meeting) RETURN target'})
  }

  , create(meetingInfo){
    const query = { query: 'CREATE (target:Meeting {createdTimestamp:{createdTimestamp}, id:{id}}) RETURN target',
                    params: {
                      createdTimestamp: meetingInfo.createdTimestamp
                      , id: meetingInfo.id
                    }
                  }
    return multiCypher(query)
  }

  , getWithRelations(meetingId) {
    
    const query = { 
      query:`MATCH (target) 
             WHERE target.id={meetingId}
             OR (target)--({id:{meetingId} }) 
             RETURN target`
      , params: {meetingId: meetingId}
    }
    return multiCypher(query)

  }

}

