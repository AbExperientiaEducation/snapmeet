const React = require('react')
const PureRenderMixin = require('react/addons').addons.PureRenderMixin
const MUI = require('material-ui')

const ContactUs = React.createClass({
  mixins: [PureRenderMixin]

  , render() {
    const modalActions = [
      <MUI.RaisedButton
        label="DONE"
        primary={true}
        onClick={()=>{this.refs.dialog.dismiss()}} 
      />
    ]

    return <div className="contact">
      <MUI.Dialog
        ref="dialog"
        title="Contact Us"
        actions={modalActions}
      >
      <p>
        <strong>Ian</strong> (CTO): <a href="mailto:ian@snapmeet.io">ian@snapmeet.io</a> - Report bugs or technical issues.
        <br />
        <strong>Ben</strong> (CEO): <a href="mailto:ben@snapmeet.io">ben@snapmeet.io</a> - For sales and press inquiries.
        <br />
        <strong>Feedback: </strong><a href="mailto:feedback@snapmeet.io">feedback@snapmeet.io</a> - For anything else.
      </p>
      </MUI.Dialog>
      <a href="javascript:void()" onClick={()=>{this.refs.dialog.show()}} >Contact Us</a>
    </div>
  }
})

module.exports = ContactUs