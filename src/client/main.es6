"use strict"
const React = require('react')
const Router = require('react-router')
const SnapmeetRouter = require('./components/SnapmeetRouter.react.es6')

const router = SnapmeetRouter.getRouter()
router.run(function (Handler, state) {
  const params = state.params
  React.render(<Handler params={params}/>, document.body)
})
