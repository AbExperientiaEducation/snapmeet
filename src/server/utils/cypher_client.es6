const neo4j = require('neo4j')
const denodeify = require('denodeify')
const db = new neo4j.GraphDatabase({
  url: '***REMOVED***'
  , auth: '***REMOVED***'
})
const co = require('co')
const _ = require('lodash')
const ErrorLogger = require('./ErrorLogger.es6')

const promiseCypher = denodeify(db.cypher.bind(db), function(err, stdout, stderr){
  if(err) ErrorLogger.log(err)
  return [err, stdout, stderr]
})

const groupResources = function(resources) {
  const res = _.groupBy(resources, n => { return n.labels[0].toUpperCase()})
  Object.keys(res).forEach(key => {
    // Our JSON attrs are nested in a 'properties' hash by DB. Iterate through each object and unwrap
    res[key] = res[key].map( nobj => {return nobj.properties})
  })
  return res
}

const getRecords = function(recordIds) {
  const nodeQuery = {
    query: `MATCH (n) 
            WHERE n.id IN {recordIds}
            RETURN n`
    , params: {recordIds: recordIds}

  }
  return co(function* (){
    try {
      const nodeData = (yield promiseCypher(nodeQuery))
      const nodes = nodeData.map(obj => {return obj.n})
      return groupResources(nodes)
    }
    catch (err) {
      ErrorLogger.log(err)
    }
  }) 
}

const recordsWithRels = function(recordIds) {
  const relQuery = {
    query: `MATCH (n)-[r]-(n2)
            WHERE n.id IN {recordIds} 
            RETURN n.id AS Node1Id, labels(n)[0] AS Node1Type, labels(n2)[0] AS Node2Type, n2.id AS Node2Id, type(r) AS RelationType`
    , params: {recordIds: recordIds}
  }
  return co(function* (){
    try {
      const relData = yield promiseCypher(relQuery)
      const res = yield getRecords(recordIds)
      res.RELATIONS = relData
      return res
    }
    catch (err) {
      ErrorLogger.log(err)
    }
  })
}

module.exports = {
  singleCypher(query, key) {
    return promiseCypher(query).then(function(data) { 
      return data.length > 0 ? data[0][key].properties : false
    })
  }

  , multiCypher(query) {
    return promiseCypher(query).then(function(data) { 
      const mappedResources = data.map(function(x) { return x.target })
      return groupResources(mappedResources)
    })
  }

  , recordsWithRels: recordsWithRels

  , records(recordIds) {
    return getRecords(recordIds)
  }

  , relateRecords(n1Id, n2Id, relName) {
    const relQuery = {
      query: `MATCH (n1 {id:{n1Id} }), (n2 {id:{n2Id}})
              MERGE (n1)-[r:${relName}]->(n2)`
      , params: {
        n1Id: n1Id
        , n2Id: n2Id
        , relName: relName
      }
    }
    return co(function* (){
      // TODO: Currently writing relation in one query, then retrieving in another. 
      // Adding RETURN n1.id AS Node1Id, n2.id AS Node2Id, type(r) AS RelationType
      // gives the outdated set of relations (prior to merge)
      yield promiseCypher(relQuery)
      const updatedResult = yield recordsWithRels(n1Id)
      return {RELATIONS: updatedResult.RELATIONS}
    })
  }

  , promiseCypher: promiseCypher
}
