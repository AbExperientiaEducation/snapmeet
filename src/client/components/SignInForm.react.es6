const React = require('react')
const SessionActions = require('../actions/SessionActionCreators.es6')
const SessionStore = require('../stores/SessionStore.es6')
const PureRenderMixin = require('react/addons').addons.PureRenderMixin

const SessionSignInForm = React.createClass({
  mixins: [PureRenderMixin]

  , signIn(e) {
    e.preventDefault()
    let email = React.findDOMNode(this.refs.email).value.trim()
    let password = React.findDOMNode(this.refs.password).value.trim()
    if (!email || !password) {
      return
    }
    SessionActions.signIn({email: email, password: password})
  }
  , register(e) {
    e.preventDefault()
    let email = React.findDOMNode(this.refs.email).value.trim()
    let password = React.findDOMNode(this.refs.password).value.trim()
    if (!email || !password) {
      return
    }
    SessionActions.signUp({email: email, password: password})
  }

  , render() {
    return (
      // A sign in form
      <form>
        <input type="email" id="email" name="email" ref="email" />
        <input type="password" id="password" name="password" ref="password" />
        <button type="submit" onClick={this.signIn}>Sign In</button> or <button type="submit" onClick={this.register}>Register</button>
      </form>
    )
  }
})

module.exports = SessionSignInForm