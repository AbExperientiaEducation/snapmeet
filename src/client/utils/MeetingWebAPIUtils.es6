const MeetingServerActionCreators = require('../actions/MeetingServerActionCreators.es6')
var reqwest = require('reqwest')
var co = require('co')

// !!! Please Note !!!
// We are using localStorage as an example, but in a real-world scenario, this
// would involve XMLHttpRequest, or perhaps a newer client-server protocol.
// The function signatures below might be similar to what you would build, but
// the contents of the functions are just trying to simulate client-server
// communication and server-side processing.

module.exports = {

  saveNewMeeting: () => {
    co(function* (){
      const meeting = yield reqwest({
        url: '/api/meetings/create'
        , method: 'post'
        , data: {timestamp: Date.now()}
      })
      // MeetingServerActionCreators.receiveCreatedMeeting(meeting)
    }) 
  }

  , getAllMeetings: () => {
    co(function* (){
      const data = yield reqwest('/api/meetings')
      MeetingServerActionCreators.receiveAll(data) 
    })
  }

  // , createMessage: function(message, threadName) {
  //   // simulate writing to a database
  //   var rawMessages = JSON.parse(localStorage.getItem('messages'));
  //   var timestamp = Date.now();
  //   var id = 'm_' + timestamp;
  //   var threadID = message.threadID || ('t_' + Date.now());
  //   var createdMessage = {
  //     id: id,
  //     threadID: threadID,
  //     threadName: threadName,
  //     authorName: message.authorName,
  //     text: message.text,
  //     timestamp: timestamp
  //   };
  //   rawMessages.push(createdMessage);
  //   localStorage.setItem('messages', JSON.stringify(rawMessages));

  //   // simulate success callback
  //   setTimeout(function() {
  //     ChatServerActionCreators.receiveCreatedMessage(createdMessage);
  //   }, 0);
  // }

}