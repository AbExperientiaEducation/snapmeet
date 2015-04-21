const MeetingSection = require('./MeetingSection.react.es6')
const React = require('react')
const PureRenderMixin = require('react/addons').addons.PureRenderMixin

const MeetingResource = require('../utils/MeetingResource.es6')
MeetingResource.getAll()

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
