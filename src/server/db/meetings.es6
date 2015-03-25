const neo4j = require('neo4j')
const db = new neo4j.GraphDatabase('***REMOVED***')
const engen = require('engen')

module.exports.fetchAll = function(){
  const cypher = engen.wrap(db.cypher.bind(db)) 
  return cypher({query: 'MATCH (u:Meeting) RETURN u'})
}

