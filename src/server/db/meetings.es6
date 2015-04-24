const neo4j = require('neo4j')
const Cypher = require('../utils/cypher_client.es6')
const multiCypher = Cypher.multiCypher
const recordsWithRels = Cypher.recordsWithRels
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
    return recordsWithRels([meetingId])
  }

}

