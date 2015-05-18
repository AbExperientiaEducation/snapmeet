const neo4j = require('neo4j')
const Cypher = require('../utils/cypher_client.es6')
const authSvc = require('../utils/auth_svc.es6')
const singleCypher = Cypher.singleCypher
const shortid = require('shortid')
/* User Data Model
  id: string
  email: string
  password: string
*/

module.exports = {
  findOne(email) {
    const query = {
        query: 'MATCH (user:User {email: {email}}) RETURN user LIMIT 1',
        params: {
          email: email,
        }
      }
    return singleCypher(query, 'user')
  }

  , findById(id) {
    const query = {
      query: 'MATCH (user:User {id: {id}}) RETURN user LIMIT 1',
      params: {
        id: id,
      }      
    }
    return singleCypher(query, 'user')
  }

  , register(email, password) {
    // do something hashy with password
    const hashedPassword = authSvc.generateHash(password)
    const query = { 
      query: `CREATE (user:User{id:{uid},email:{email},password:{password}}) 
              RETURN user`
      , params: {
        email: email
        , password: hashedPassword
        , uid: shortid.generate()

      }
    }
    return singleCypher(query, 'user')
  }

  , registerAnonymous(){
    const query = { 
      query: `CREATE (user:User{id:{uid}}) 
              RETURN user`
      , params: {uid: shortid.generate()}
    }
    return singleCypher(query, 'user')
  }

  , validPassword(user, password){
    return authSvc.validPassword(password, user.password)
  }

  , getWithRelations(ids) {
    return Cypher.recordsWithRels(ids)
  }

  , getRecords(ids) {
    return Cypher.records(ids)
  }

  , relateRecordToUser(recordId, userId, relName) {
    return Cypher.relateRecords(recordId, userId, relName)
  }
}
