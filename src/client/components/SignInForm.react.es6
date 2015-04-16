const React = require('react')
const SessionClientActions = require('../actions/SessionClientActionCreators.es6')
const SessionStore = require('../stores/SessionStore.es6')
const PureRenderMixin = require('react/addons').addons.PureRenderMixin

const getStateFromStore = () => {
  return {
    session: SessionStore.currentUserSession()
  }
}

const SessionSignInForm = React.createClass({
  mixins: [PureRenderMixin]
  
  , getInitialState() {
    return getStateFromStore()
  }

  , componentDidMount() {
    SessionStore.addChangeListener(this._onChange)
  }

  , componentWillUnmount() {
    SessionStore.removeChangeListener(this._onChange)
  }

  , signIn(e) {
    e.preventDefault()
    let email = React.findDOMNode(this.refs.email).value.trim()
    let password = React.findDOMNode(this.refs.password).value.trim()
    if (!email || !password) {
      return
    }
    SessionClientActions.signIn({email: email, password: password})
  }
  , register(e) {
    e.preventDefault()
    let email = React.findDOMNode(this.refs.email).value.trim()
    let password = React.findDOMNode(this.refs.password).value.trim()
    if (!email || !password) {
      return
    }
    SessionClientActions.signUp({email: email, password: password})
  }

  , render() {
    let session = this.state.session
    let welcome
    if (session) {
      welcome = <div>Hello, {session.user.email}</div>
    }
    return (
      // A sign in form
      <form>
        {welcome}
        <input type="email" id="email" name="email" ref="email" />
        <input type="password" id="password" name="password" ref="password" />
        <button type="submit" onClick={this.signIn}>Sign In</button> or <button type="submit" onClick={this.register}>Register</button>
      </form>
    )
  }

   /**
   * Event handler for 'change' events coming from the MessageStore
   */
  , _onChange() {
    this.setState(getStateFromStore())
  }
})

module.exports = SessionSignInForm