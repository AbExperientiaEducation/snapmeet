const Router = require('react-router')
const React = require('react')
const Route = Router.Route
const NotFoundRoute = Router.NotFoundRoute
const DefaultRoute = Router.DefaultRoute
const Link = Router.Link
const RouteHandler = Router.RouteHandler
const App = require('./MeetgunApp.react.es6')

const routes = (
  <Route name="app" path="/" handler={App}>
  </Route>
)

module.exports = routes