const neo4j = require('neo4j')
const cypherClient = require('../utils/cypher_client.es6')
const authSvc = require('../utils/auth_svc.es6')

const singleCypher = function(query) {
  return cypherClient(query).then(function(data) { 
    console.log(data)
    return data.length > 0 ? data[0].user : false
  })
}

/* User Data Model
  uid: int
  email: string
  password: string
*/

module.exports.findOne = function(email){  
  return singleCypher({ query: 'MATCH (user:User {email: {email}}) RETURN user LIMIT 1',
                        params: {
                          email: email,
                        }
                      })
}

module.exports.register = function(email, password){
  // do something hashy with password
  var hashedPassword = authSvc.generateHash(password)
  return singleCypher({ query: 'MERGE (id:UniqueId{name:"User"}) ON CREATE SET id.count = 1 ON MATCH SET id.count = id.count + 1 WITH id.count AS uid CREATE (p:User{id:uid,email:{email},password:{password}}) RETURN p AS user',
                        params: {
                          email: email,
                          password: hashedPassword,
                        }
                      })
}

module.exports.findById = function(id) {
  return singleCypher({ query: 'MATCH (user:User {uid: {id}}) RETURN user LIMIT 1',
                        params: {
                          id: id,
                        }
                      })
}

module.exports.validPassword = function(user, password){
  return authSvc.validPassword(password, user.properties.password)
}
