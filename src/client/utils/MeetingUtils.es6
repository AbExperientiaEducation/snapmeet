module.exports = {
  convertRawMeeting: (rawMeeting) => {
    return {
      id: rawMeeting._id
      , name: rawMeeting.properties.name
      , date: new Date(rawMeeting.properties.timestamp),
    }
  },

  getCreatedMeetingData: () => {
    const timestamp = Date.now()
    return {
      id: `m_${timestamp}`
      , date: new Date(timestamp)
    }
  }
}