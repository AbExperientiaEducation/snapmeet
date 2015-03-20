var React = require('react')

var DemoView = require('./views/demo.es6') // need to specify the es6 extension
React.render(
  <DemoView />, 
  document.getElementById('content')
)
