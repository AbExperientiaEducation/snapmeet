const neo4j = require('neo4j')
const db = new neo4j.GraphDatabase('***REMOVED***')
const Q = require('q')

module.exports.fetchAll = function(){
  throw('foobar')
  const cypher = Q.denodeify(db.cypher.bind(db)) 
  return cypher({query: 'MATCH (u:Meeting) RETURN u'})
}

