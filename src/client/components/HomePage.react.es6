const MeetingSection = require('./MeetingSection.react.es6')
const React = require('react')
const PureRenderMixin = require('react/addons').addons.PureRenderMixin

const HomePage = React.createClass({
  mixins: [PureRenderMixin]
  , render() {
    return (
      <div className="home">
        <MeetingSection />
      </div>
    )
  }
})

module.exports = HomePage
