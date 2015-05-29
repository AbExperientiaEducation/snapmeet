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

    const handleFocus = function(e) {
      const target = e.target
      setTimeout(function(){target.select()}, 0)
    }
    return <span>
        <MUI.Dialog
          title="Share Meeting"
          actions={actions}
          dismissOnClickAway={true}
          ref="dialog"
        >
          <p>Share this link with anyone you want to join your meeting:</p>
          <input className="share-box" autoFocus={true} onFocus={handleFocus}  defaultValue={link} />
        </MUI.Dialog>
        <MUI.RaisedButton onClick={showSignInModal}>
          <span className="mui-raised-button-label share-label">
            Share
            <span className="fa fa-share-alt" />
          </span>
        </MUI.RaisedButton>
      </span>
  }
        
})

module.exports = ShareWidget
