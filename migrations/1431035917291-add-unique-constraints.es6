const promiseCypher = require('../src/server/utils/cypher_client.es6').promiseCypher
const co = require('co')

exports.up = function(next){
  co(function* (){
    yield promiseCypher("CREATE CONSTRAINT ON (n:Meeting) ASSERT n.id IS UNIQUE")
    yield promiseCypher("CREATE CONSTRAINT ON (n:Org) ASSERT n.id IS UNIQUE")
    yield promiseCypher("CREATE CONSTRAINT ON (n:Task) ASSERT n.id IS UNIQUE")
    yield promiseCypher("CREATE CONSTRAINT ON (n:Use) ASSERT n.id IS UNIQUE")
    yield promiseCypher("CREATE CONSTRAINT ON (n:VCRoom) ASSERT n.id IS UNIQUE")
    next();
  })
};

exports.down = function(next){
  co(function* (){
    yield promiseCypher("DROP CONSTRAINT ON (n:Meeting) ASSERT n.id IS UNIQUE")
    yield promiseCypher("DROP CONSTRAINT ON (n:Org) ASSERT n.id IS UNIQUE")
    yield promiseCypher("DROP CONSTRAINT ON (n:Task) ASSERT n.id IS UNIQUE")
    yield promiseCypher("DROP CONSTRAINT ON (n:Use) ASSERT n.id IS UNIQUE")
    yield promiseCypher("DROP CONSTRAINT ON (n:VCRoom) ASSERT n.id IS UNIQUE")
    next();
  })
};
