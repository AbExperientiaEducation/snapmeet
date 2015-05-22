const relPrefix = '../../../node_modules/material-ui/src/js/'
var React = require('react');
var Classable = require('material-ui/lib/js/mixins/classable');
var ClickAwayable = require(  'material-ui/lib/js/mixins/click-awayable');
var KeyLine = require( 'material-ui/lib/js/utils/key-line');
var Paper = require( 'material-ui/lib/js/paper');
var FontIcon = require( 'material-ui/lib/js/font-icon');
var Menu = require( 'material-ui/lib/js/menu/menu');

var DropDownIcon = React.createClass({displayName: "DropDownIcon",

  mixins: [Classable, ClickAwayable],

  propTypes: {
    onChange: React.PropTypes.func,
    menuItems: React.PropTypes.array.isRequired,
    closeOnMenuItemClick: React.PropTypes.bool,
    selectedIndex: React.PropTypes.number
  },

  getInitialState: function() {
    return {
      open: false
      , selectedIndex: this.props.selectedIndex
    }
  },
  
  getDefaultProps: function() {
    return {
      closeOnMenuItemClick: true
    }
  },

  componentClickAway: function() {
    this.setState({ open: false });
  },

  render: function() {
    var classes = this.getClasses('mui-drop-down-icon', {
      'mui-open': this.state.open
    });

    var icon;
    if (this.props.iconClassName) icon = React.createElement(FontIcon, {className: this.props.iconClassName});
   
    return (
      React.createElement("div", {className: classes}, 
          React.createElement("div", {className: "mui-menu-control", onClick: this._onControlClick}, 
              icon, 
              this.props.children
          ), 
          React.createElement(Menu, {ref: "menuItems", menuItems: this.props.menuItems, selectedIndex: this.props.selectedIndex, hideable: true, visible: this.state.open, onItemClick: this._onMenuItemClick})
        )
    );
  },

  _onControlClick: function(e) {
    this.setState({ open: !this.state.open });
  },

  _onMenuItemClick: function(e, key, payload) {
    if (this.props.onChange) this.props.onChange(e, key, payload);
    
    if (this.props.closeOnMenuItemClick) {
      this.setState({ open: false });
    }
  }

});

module.exports = DropDownIcon;
