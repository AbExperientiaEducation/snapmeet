const neo4j = require('neo4j')
const Q = require('q')
const db = new neo4j.GraphDatabase({
  url: '***REMOVED***'
  , auth: '***REMOVED***'
})
const cypher = Q.denodeify(db.cypher.bind(db)) 

module.exports.fetchAll = function(){  
  return cypher({query: 'MATCH (meeting:Meeting) RETURN meeting'})
}

module.exports.create = function(meetingInfo){
  qstring = 'CREATE (meeting:Meeting {timestamp:' + meetingInfo.timestamp + ') RETURN meeting'
  return cypher({query: qstring})
}

