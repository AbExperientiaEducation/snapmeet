const neo4j = require('neo4j')
const cypherClient = require('../utils/cypher_client.es6')

const cypher = function(query) {
  return cypherClient(query).then(function(data) { 
    return data.map(function(x) { return x.user }) 
  })
}

module.exports.findOne = function(username){  
  return cypherClient({ query: 'MATCH (user:User {username: {username}}) LIMIT 1 RETURN user',
                        parameters: {
                          username: username,
                        }
                      })
}
