const co = require('co')
const DBTasks = require('../db/tasks.es6')
const TaskUtils = require('../../shared/utils/TaskUtils.es6')

const register = function(app) {
  app.get('/api/tasks', function(req, res) {
    co(function* (){
      const tasks = yield DBTasks.fetchAll() 
      res.json(tasks)
    })
  })

  app.post('/api/tasks/create', function(req, res){
    const taskJson = req.body
    co(function* (){
      const taskResponse = yield DBTasks.create(taskJson)
      res.json(taskResponse[0])
    })
  })
}

module.exports = {
  register: register
}
