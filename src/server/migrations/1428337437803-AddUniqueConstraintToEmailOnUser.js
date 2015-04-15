const co = require('co')
const cypherClient = require('../utils/cypher_client.es6')

exports.up = function(next){
  co(function *(){
    cypherClient({query: 'CREATE CONSTRAINT ON (user:User) ASSERT user.email IS UNIQUE'})
  })
  next();
};

exports.down = function(next){
  co(function *(){
    cypherClient({query: 'DROP CONSTRAINT ON (user:User) ASSERT user.email IS UNIQUE'})
  })
  next();
};
