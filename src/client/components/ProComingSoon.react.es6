const React = require('react')
const SessionClientActions = require('../actions/SessionClientActionCreators.es6')
const PureRenderMixin = require('react/addons').addons.PureRenderMixin
const MUI = require('material-ui')
const PriceBox = require('./PriceBox.react.es6')
const Analytics = require('../utils/Analytics.es6')

const modalStates = ['upsell', 'interested', 'submitted']

const ProComingSoon = React.createClass({
  mixins: [PureRenderMixin]

  , getInitialState() {
    return {modalState: modalStates[0]}
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
    const showSignInModal = () => {
      this.refs.dialog.show()
      Analytics.track('Sign Up')
    }
    const hideSignInModal = () => {
      this.refs.dialog.dismiss()
      Analytics.track('Hide Sign Up')
    }
    const submitFn = (e) => {
      switch(this.state.modalState) {
        case modalStates[0]:
          this.setState({modalState: modalStates[1]})
          Analytics.track('Go Pro')
          break
        case modalStates[1]:
          this.handleSubmit(e)
          setTimeout(hideSignInModal, 2000)
          this.setState({modalState: modalStates[2]})
          Analytics.track('Pro Email Signup')
          break
        case modalStates[2]:
          hideSignInModal()
          break
      }
    }

    let contents
    let title
    let doneLabel
    switch(this.state.modalState) {
      case modalStates[0]:
        title = "Snapmeet Pro Required"
        doneLabel = "Go Pro"
        contents = <div className="pro-box">
          <p>Sign in is a Snapmeet Pro feature. Upgrade to Snapmeet Pro for:</p>
          <ul>
            <li><strong>Login by Email:</strong> Never worry about losing a meeting.</li>
            <li><strong>Enhanced Security:</strong> Restrict meeting access to authorized users.</li>
            <li><strong>Company Sharing:</strong> Quickly add your colleagues, or make meetings visible to anyone in your company.</li>
            <li><strong>Quick Reference:</strong> Easily refer back to the last meeting notes and action items.</li>
            <li><strong>Stored Identity:</strong> See who made a change in the notes.</li>
          </ul>

          <ul className="pro-options">
            <li>
              <PriceBox 
                label="Hobby"
                price={8}
                maxUsers={2}
              />
            </li>
            <li>
              <PriceBox
                label="Team"
                price={45}
                maxUsers={10}
              />
            </li>
            <li>
              <PriceBox 
                label="Division"
                price={199}
                maxUsers={50}
              />
            </li>
            <li>
              <PriceBox
                label="Enterprise"
              />
            </li>
          </ul>
        </div>
        break
      case modalStates[1]:
        title = "Pro Is Coming Soon"
        doneLabel = "Notify Me"
        contents = (
          <div>
            <p>Snapmeet Pro is coming soon, but it's not here yet.<br />
            Enter your email to be notified as soon as it is launched.</p>
            <form>
              <MUI.TextField type="email" id="email" name="email" ref="email" hintText="Email"/>
            </form>
          </div>)
        break
      case modalStates[2]:
        title = "Snapmeet Pro Coming Soon"
        doneLabel = "Close"
        contents = <div>
          <h3>Thanks for the interest!</h3>
          <p>We'll let you know as soon as Snapmeet Pro is available.</p>
        </div>
        break
    }

    const modalActions = [
      <MUI.FlatButton
        label="Cancel"
        key="Cancel"
        secondary={true}
        onClick={hideSignInModal}
      />,
      <MUI.RaisedButton
        key="Done"
        label={doneLabel}
        primary={true}
        onClick={submitFn} 
      />
    ]

    return <div>
      <MUI.Dialog
        ref="dialog"
        title={title}
        actions={modalActions}
        className="sign-in"
      >
      {contents}
      </MUI.Dialog>
      <MUI.RaisedButton onClick={showSignInModal}>Sign Up
      </MUI.RaisedButton>
    </div>
  }
})

module.exports = ProComingSoon