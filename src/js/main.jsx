var React = require('react');

var DemoView = require('./views/demo.jsx'); // need to specify the jsx extension
React.render(
  <DemoView />, 
  document.getElementById('content')
);
