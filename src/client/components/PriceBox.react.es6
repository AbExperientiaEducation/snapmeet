const React = require('react')
const ReactPropTypes = React.PropTypes

const PriceBox = React.createClass({
  propTypes: {
    label: ReactPropTypes.string
    , price: ReactPropTypes.number
    , maxUsers: ReactPropTypes.number
  }

  , render() {
    let contents
    if(this.props.price) {
      contents = <div>
        <p className="user-limit">Up to {this.props.maxUsers}
          <br />
          users
        </p>
        <p className="price">
          <span className="dollar">$</span>{this.props.price}<span className="price-details"> / mo</span>
        </p>
      </div>
    } else {
      contents = <div>
        <p className="user-limit">Contact Us For Pricing</p>
      </div>
    }
    return <div className="price-box">
      <h3>{this.props.label}</h3>
      {contents}
    </div>
  }
})

module.exports = PriceBox
