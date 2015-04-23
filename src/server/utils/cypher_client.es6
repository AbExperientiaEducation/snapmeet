const neo4j = require('neo4j')
const denodeify = require('denodeify')
const db = new neo4j.GraphDatabase({
  url: '***REMOVED***'
  , auth: '***REMOVED***'
})

const promiseCypher = denodeify(db.cypher.bind(db), function(err, stdout, stderr){
  if(err) console.log(err)
  return [err, stdout, stderr]
})

module.exports = {
  singleCypher(query) {
    return promiseCypher(query).then(function(data) { 
      return data.length > 0 ? data[0].user.properties : false
    })
  }

  , multiCypher(query) {
    return promiseCypher(query).then(function(data) { 
      return data.map(function(x) { return x.target }) 
    })
  }
}
