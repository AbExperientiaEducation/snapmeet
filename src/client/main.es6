"use strict"
const React = require('react')
const Router = require('react-router')
const routes = require('./components/MeetgunRouter.react.es6')

Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.body)
})
