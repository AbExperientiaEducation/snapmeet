let router

module.exports = {
  getRouter() {
    return router
  }
}

const Router = require('react-router')
const React = require('react')
const Route = Router.Route
const DefaultRoute = Router.DefaultRoute
const RouteHandler = Router.RouteHandler
const HomePage = require('./HomePage.react.es6')
const App = require('./SnapmeetApp.react.es6')
const MeetingDetailPage = require('./MeetingDetailPage.react.es6')

const routes = (
  <Route name='app' path='/' handler={App}>
    <Route name='meeting' path='/meetings/:id' handler={MeetingDetailPage} />
    <DefaultRoute name='home' handler={HomePage}/>
  </Route>
)

router = Router.create({
  routes: routes,
  location: Router.HistoryLocation
})
