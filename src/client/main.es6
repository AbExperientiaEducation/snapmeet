"use strict"
const React = require('react')
const Router = require('react-router')
const routes = require('./components/MeetgunRouter.react.es6')

Router.run(routes, function (Handler, state) {
  const params = state.params
  React.render(<Handler params={params}/>, document.body)
})
