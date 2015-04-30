const React = require('react')
const SessionClientActions = require('../actions/SessionClientActionCreators.es6')
const SessionStore = require('../stores/SessionStore.es6')
const PureRenderMixin = require('react/addons').addons.PureRenderMixin
const MUI = require('material-ui')

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

  , handleLoginSubmit(e, sessionFn) {
    e.preventDefault()
    const email = this.refs.email.getValue()
    const password = this.refs.password.getValue()
    if (!email || !password) {
      return
    }
    sessionFn({email: email, password: password})
  }

  , signIn(e) {
    this.handleLoginSubmit(e, SessionClientActions.signIn)
  }

  , register(e) {
    this.handleLoginSubmit(e, SessionClientActions.signUp)
  }

  , render() {
    const session = this.state.session
    let signInArea
    if (session) {
      signInArea = <div>Hello, {session.user.email}</div>
    } else {
      signInArea = this.makeLoginComponents()
    }
    return (
      // A sign in form
      <div>
        {signInArea}
      </div>
    )
  }

  , makeLoginComponents() {
    const showSignInModal = () => {this.refs.dialog.show()}
    const hideSignInModal = () => {this.refs.dialog.dismiss()}
    const setSignIn = () => {this.setState({loginType: 'signIn'})}
    const setSignUp = () => {this.setState({loginType: 'signUp'})}
    const submitFn = (e) => {
      const handlerFn = this.state.loginType == 'signUp' ? SessionClientActions.signUp : SessionClientActions.signIn
      this.handleLoginSubmit(e, handlerFn)
      hideSignInModal()
    }
    const submitLabel = () => {
      return this.state.loginType == 'signUp' ? "Register" : "Sign In"
    }
    const modalActions = [
      <MUI.FlatButton
        label="Cancel"
        secondary={true}
        onClick={hideSignInModal}
      />,
      <MUI.RaisedButton
        label={submitLabel()}
        primary={true}
        onClick={submitFn} 
      />
      ]
      return <div>
        <MUI.Dialog
          ref="dialog"
          title="Sign In To Meetgun"
          actions={modalActions}
          className="sign-in"
        >
          <form>
            <MUI.TextField type="email" id="email" name="email" ref="email" hintText="Email"/>
            <br />
            <MUI.TextField type="password" id="password" name="password" ref="password" hintText="Password"/>
            <MUI.RadioButtonGroup 
              name="loginType"
              defaultSelected="signIn"
            >
              <MUI.RadioButton
                onClick={setSignIn}
                value="signIn"
                label="Sign In"
              />
              <MUI.RadioButton
                onClick={setSignUp}
                value="signUp"
                label="Register"
              />
            </MUI.RadioButtonGroup>
          </form>
        </MUI.Dialog>
        <MUI.RaisedButton onClick={showSignInModal}>Sign In
        </MUI.RaisedButton>
      </div>
  }

   /**
   * Event handler for 'change' events coming from the MessageStore
   */
  , _onChange() {
    this.setState(getStateFromStore())
  }
})

module.exports = SessionSignInForm