const React = require('react')
const SessionActions = require('../actions/SessionActionCreators.es6')
const SessionStore = require('../stores/SessionStore.es6')
const PureRenderMixin = require('react/addons').addons.PureRenderMixin

const SessionSignInForm = React.createClass({
  mixins: [PureRenderMixin]

  , signIn: function(e) {
    e.preventDefault()
    let email = React.findDOMNode(this.refs.email).value.trim()
    let password = React.findDOMNode(this.refs.password).value.trim()
    if (!email || !password) {
      return
    }
    SessionActions.signIn({email: email, password: password})
  }

  , render: function() {
    return (
      // A sign in form
      <form onSubmit={this.signIn}>
        <input type="email" id="email" name="email" ref="email" />
        <input type="password" id="password" name="password" ref="password" />
        <button type="submit">Sign In</button>
      </form>
    )
  }
})

module.exports = SessionSignInForm