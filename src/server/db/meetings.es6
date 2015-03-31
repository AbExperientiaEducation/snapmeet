const neo4j = require('neo4j')
const Q = require('q')
const db = new neo4j.GraphDatabase({
  url: '***REMOVED***'
  , auth: '***REMOVED***'
})
const cypher = function(query) {
  promisifiedCypher = Q.denodeify(db.cypher.bind(db))
  return promisifiedCypher(query).then(function(data) { 
    return data.map(function(x) { return x.meeting }) 
  })
}


module.exports.fetchAll = function(){  
  return cypher({ query: 'MATCH (meeting:Meeting) RETURN meeting'})
}

module.exports.create = function(meetingInfo){
  qstring = 'CREATE (meeting:Meeting {timestamp:' + meetingInfo.timestamp + ', id: "' + meetingInfo.id + '"}) RETURN meeting'
  return cypher({query: qstring})
}

