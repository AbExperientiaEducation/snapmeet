const React = require('react')
const SessionActions = require('../actions/SessionActionCreators.es6')
const SessionStore = require('../stores/SessionStore.es6')
const PureRenderMixin = require('react/addons').addons.PureRenderMixin

const SessionSignInForm = React.createClass({
  mixins: [PureRenderMixin]

  , signIn: function(data) {
    SessionActions.signIn(data)
  }

  , render: function() {
    return (
      // A sign in form
      <form>
        <button onClick={this.signIn('hello')}>Sign In</button>
      </form>
    )
  }
})

module.exports = SessionSignInForm