const neo4j = require('neo4j')
const engen = require('engen')
const db = new neo4j.GraphDatabase({
  url: '***REMOVED***'
  , auth: '***REMOVED***'
})
const cypher = engen.wrap(db.cypher.bind(db)) 

module.exports.fetchAll = function(){  
  return cypher({query: 'MATCH (u:Meeting) RETURN u'})
}
