const cypher = require('../utils/cypher_client.es6')
const singleCypher = cypher.singleCypher
const recordsWithRels = cypher.recordsWithRels

const getWithRelations = function(orgId) {
  return recordsWithRels([orgId])
}

const create = function(orgInfo){
  const createOrgQuery = { 
    query: `CREATE (target:Org {orgInfo})
            RETURN target`
    , params: {
      orgInfo: {
        createdTimestamp: orgInfo.createdTimestamp
        , id: orgInfo.id
        , displayName: orgInfo.displayName        
      }
    }
  }
  return singleCypher(createOrgQuery, 'target')
}

const demoCreate = function(){
  return create({
    createdTimestamp: Date.now()
    , id: '*TEST*'
    , displayName: '*TEST* Picolab'
  })
}

module.exports = {
  create: create
  , getWithRelations: getWithRelations
  , demoCreate: demoCreate
}