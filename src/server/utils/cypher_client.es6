const neo4j = require('neo4j')
const denodeify = require('denodeify')
const db = new neo4j.GraphDatabase({
  url: '***REMOVED***'
  , auth: '***REMOVED***'
})

module.exports = denodeify(db.cypher.bind(db), function(err, stdout, stderr){
  if(err) console.log(err)
  return [err, stdout, stderr]
})
