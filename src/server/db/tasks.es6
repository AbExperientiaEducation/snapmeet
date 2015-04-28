const co = require('co')
const cypher = require('../utils/cypher_client.es6')
const singleCypher = cypher.singleCypher
const recordsWithRels = cypher.recordsWithRels

const getWithRelations = function(ids) {
  return recordsWithRels(ids)
}

const runQueryAndReturnNodeRelations = function(query) {
  return co(function* (){
    try {
      const modified = yield singleCypher(query, 'target')
      return yield getWithRelations([modified.id])
    }
    catch(err) {
      console.log(err.stack)
    }
  })
}

const create = function(taskInfo){
  const query = { 
    query: `MATCH (m:Meeting)
            WHERE m.id = {meetingId}
            CREATE (target:Task {taskProps})-[r:MEETING_TASK]->(m)
            RETURN target`
    , params: {
      taskProps: {
        createdTimestamp: taskInfo.createdTimestamp
        , id: taskInfo.id
      }
      , meetingId: taskInfo.meetingId
    }
  }
  return runQueryAndReturnNodeRelations(query)
}

const update = function(taskInfo) {
  const query = {
    query: `MATCH (target:Task)
            WHERE target.id = '${taskInfo.id}'
            SET target = {taskProps}
            RETURN target`
    , params: {
      taskProps: taskInfo
    }
  }
  return runQueryAndReturnNodeRelations(query)
}


module.exports = {
  create: create
  , update: update
  , getWithRelations: getWithRelations
}
