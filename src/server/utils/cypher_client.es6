const neo4j = require('neo4j')
const denodeify = require('denodeify')
const db = new neo4j.GraphDatabase({
  url: '***REMOVED***'
  , auth: '***REMOVED***'
})
const co = require('co')
const _ = require('lodash')

const promiseCypher = denodeify(db.cypher.bind(db), function(err, stdout, stderr){
  if(err) console.log(err)
  return [err, stdout, stderr]
})

const groupResources = function(resources) {
  const response = {}
  resources.forEach(function(resource){
    resource.labels.forEach(function(label){
      label = label.toUpperCase()
      if(!response[label]) response[label] = []
      // Our JSON attrs are nested in a 'properties' hash by DB. Unwrap them.
      response[label].push(resource.properties)
    })
    delete resource.labels
  })
  return response
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

  , recordsWithRels(recordIds) {
    const nodeQuery = {
      query: `MATCH (n) 
              WHERE n.id IN {recordIds}
              RETURN n`
      , params: {recordIds: recordIds}

    }
    const relQuery = {
      query: `MATCH (n)-[r]-(n2)
              WHERE n.id IN {recordIds} 
              RETURN n.id AS Node1Id, n2.id AS Node2Id, type(r) AS RelationType`
      , params: {recordIds: recordIds}
    }
    return co(function* (){
      try {
        const nodeData = (yield promiseCypher(nodeQuery))
        const relData = yield promiseCypher(relQuery)
        const nodes = nodeData.map(obj => {return obj.n})
        const res = _.groupBy(nodes, n => { return n.labels[0].toUpperCase()})
        Object.keys(res).forEach(key => {
          res[key] = res[key].map( nobj => {return nobj.properties})
        })
        res.RELATIONS = relData
        return res
      }
      catch (err) {
        console.log(err)
      }
    })
  }
}
