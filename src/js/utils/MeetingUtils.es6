module.exports = {
  convertRawMeeting: (rawMeeting) => {
    return {
      id: rawMeeting.id
      , date: new Date(rawMeeting.timestamp),
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