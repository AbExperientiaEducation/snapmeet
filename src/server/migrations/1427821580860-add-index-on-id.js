const co = require('co')
const cypherClient = require('../utils/cypher_client.es6')

exports.up = function(next){
  co(function *(){
    cypherClient({query: 'CREATE INDEX ON :Meeting(id)'})
  })
  next();
};

exports.down = function(next){
  co(function *(){
    cypherClient({query: 'DROP INDEX ON :Meeting(id)'})
  })
  next();
};
