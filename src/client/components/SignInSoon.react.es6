const React = require('react')
const SessionClientActions = require('../actions/SessionClientActionCreators.es6')
const PureRenderMixin = require('react/addons').addons.PureRenderMixin
const MUI = require('material-ui')

const SignInSoon = React.createClass({
  mixins: [PureRenderMixin]

  , getInitialState() {
    return {}
  }
  
  , handleSubmit(e) {
    e.preventDefault()
    const email = this.refs.email.getValue()
    if (!email) {
      return
    }
    this.setState({submitted: true})
    SessionClientActions.notifyMe({email: email})
  }

  , render() {
    const signInArea = this.makeLoginComponents()

    return (
      <div>
        {signInArea}
      </div>
    )
  }

  , makeLoginComponents() {
    const showSignInModal = () => {this.refs.dialog.show()}
    const hideSignInModal = () => {this.refs.dialog.dismiss()}
    const submitFn = (e) => {
      if(this.state.submitted) {
        return hideSignInModal()
      }
      this.handleSubmit(e)
      setTimeout(hideSignInModal, 2000)
    }
    const doneLabel = this.state.submitted ? "Close" : "Notify Me"
    const modalActions = [
      <MUI.FlatButton
        label="Cancel"
        secondary={true}
        onClick={hideSignInModal}
      />,
      <MUI.RaisedButton
        label={doneLabel}
        primary={true}
        onClick={submitFn} 
      />
      ]

      let contents
      if(this.state.submitted) {
        contents = <div>
          <h3>Thanks for the interest!</h3>
          <p>We'll let you know as soon as sign in is available.</p>
        </div>

      } else {
        contents = (
          <div>
            <p>We're adding sign-in soon, but it's not here yet.<br />
            Enter your email to be notified as soon as we add it.</p>
            <form>
              <MUI.TextField type="email" id="email" name="email" ref="email" hintText="Email"/>
            </form>
          </div>)
      }
      return <div>
        <MUI.Dialog
          ref="dialog"
          title="Sign In Coming Soon"
          actions={modalActions}
          className="sign-in"
        >
        {contents}
        </MUI.Dialog>
        <MUI.RaisedButton onClick={showSignInModal}>Sign In
        </MUI.RaisedButton>
      </div>
  }
})

module.exports = SignInSoon