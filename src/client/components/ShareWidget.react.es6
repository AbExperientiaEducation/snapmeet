const React = require('react')
const PureRenderMixin = require('react/addons').addons.PureRenderMixin
const MUI = require('material-ui')
const Analytics = require('../utils/Analytics.es6')

const ShareWidget = React.createClass({
  mixins: [PureRenderMixin]
  , render() {
    const actions = [{ text: 'Done'}]
    const showSignInModal = () => {
      this.refs.dialog.show()
      Analytics.track('Share Meeting')
    }
    const link = window.location.href
    return <span>
        <MUI.Dialog
          title="Share Meeting"
          actions={actions}
          dismissOnClickAway={true}
          ref="dialog"
        >
          <p>Others can join your meeting by visiting this page:</p>
          <p>{link}</p>
        </MUI.Dialog>
        <MUI.IconButton iconClassName="fa fa-share-alt" onClick={showSignInModal}/>
      </span>
  }
        
})

module.exports = ShareWidget
