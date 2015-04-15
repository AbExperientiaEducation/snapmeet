const SessionActionCreators = require('../actions/SessionActionCreators.es6')
var reqwest = require('reqwest')
var co = require('co')

module.exports = {

  signIn: (data) => {
    alert("In the util" + data)
    co(function* (){
      const session = yield reqwest({
        url: '/login'
        , method: 'post'
        , data: {username: data.email, password: data.password}
      })
    })
  }
}