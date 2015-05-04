const co = require('co')
const neo4j = require('neo4j')
const Cypher = require('../utils/cypher_client.es6')
const singleCypher = Cypher.singleCypher

const create = function(info){
  const query = { 
    query: `CREATE (target:InterestedEmail {email: {email}})
            RETURN target`
    , params: {
      email: info.email
    }
  }

  return co(function* (){
    try {
      return yield singleCypher(query, 'target')
    }
    catch(err) {
      console.error(err.stack)
    }
  })    
}

module.exports = {create: create}
