module.exports = {
  init: function() {
    localStorage.clear();
    localStorage.setItem('meetings', JSON.stringify([
      {
        id: 'm_1',
        timestamp: Date.now() - 99999
      }
      , {
        id: 'm_2',
        timestamp: Date.now() - 89999
      }
      , {
        id: 'm_3',
        timestamp: Date.now() - 79999
      }

    ]))
  }

}