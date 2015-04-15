const Router = require('react-router')
const React = require('react')
const Route = Router.Route
const NotFoundRoute = Router.NotFoundRoute
const DefaultRoute = Router.DefaultRoute
const RouteHandler = Router.RouteHandler
const HomePage = require('./HomePage.react.es6')
const App = require('./MeetgunApp.react.es6')
const MeetingDetailPage = require('./MeetingDetailPage.react.es6')

const routes = (
  <Route name='app' path='/' handler={App}>
    <Route name='meeting' path='/meetings/:id' handler={MeetingDetailPage} />
    <DefaultRoute handler={HomePage}/>
  </Route>
)

module.exports = routes