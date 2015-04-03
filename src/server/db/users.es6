const neo4j = require('neo4j')
const cypherClient = require('../utils/cypher_client.es6')

const singleCypher = function(query) {
  return cypherClient(query).then(function(data) { 
    return data.length > 0 ? data[0].user : false
  })
}

module.exports.findOne = function(username){  
  return singleCypher({ query: 'MATCH (user:User {username: {username}}) RETURN user LIMIT 1',
                        params: {
                          username: username,
                        }
                      })
}

module.exports.validPassword = function(user, password){
  return user.properties.password == password
}
