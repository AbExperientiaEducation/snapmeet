const neo4j = require('neo4j')
const singleCypher = require('../utils/cypher_client.es6').singleCypher
const authSvc = require('../utils/auth_svc.es6')

/* User Data Model
  id: int
  email: string
  password: string
*/

module.exports.findOne = function(email){  
  return singleCypher({ query: 'MATCH (user:User {email: {email}}) RETURN user LIMIT 1',
                        params: {
                          email: email,
                        }
                      }, 'user')
}

module.exports.findById = function(id) {
  return singleCypher({ query: 'MATCH (user:User {id: {id}}) RETURN user LIMIT 1',
                        params: {
                          id: id,
                        }
                      }, 'user')
}

module.exports.register = function(email, password){
  // do something hashy with password
  const hashedPassword = authSvc.generateHash(password)
  return singleCypher({ query: 'MERGE (id:UniqueId{name:"User"}) ON CREATE SET id.count = 1 ON MATCH SET id.count = id.count + 1 WITH id.count AS uid CREATE (p:User{id:uid,email:{email},password:{password}}) RETURN p AS user',
                        params: {
                          email: email,
                          password: hashedPassword,
                        }
                      }, 'user')
}

module.exports.registerAnonymous = function(){
  // do something hashy with password
  return singleCypher({ query: 'MERGE (id:UniqueId{name:"User"}) ON CREATE SET id.count = 1 ON MATCH SET id.count = id.count + 1 WITH id.count AS uid CREATE (p:User{id:uid}) RETURN p AS user',
                      }, 'user')
}

module.exports.validPassword = function(user, password){
  return authSvc.validPassword(password, user.password)
}
