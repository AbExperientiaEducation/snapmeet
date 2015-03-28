(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var MeetgunApp = require("./components/MeetgunApp.react.es6");
var ExampleData = require("./ExampleData.es6");
var MeetingWebAPIUtils = require("./utils/MeetingWebAPIUtils.es6");
var React = require("react");
ExampleData.init();

MeetingWebAPIUtils.getAllMeetings();

React.render(React.createElement(MeetgunApp, null), document.getElementById("content"));

},{"./ExampleData.es6":3,"./components/MeetgunApp.react.es6":5,"./utils/MeetingWebAPIUtils.es6":13,"react":"react"}],2:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],3:[function(require,module,exports){
"use strict";

module.exports = {
  init: function init() {
    localStorage.clear();
    localStorage.setItem("meetings", JSON.stringify([{
      id: "m_1",
      timestamp: Date.now() - 99999
    }, {
      id: "m_2",
      timestamp: Date.now() - 89999
    }, {
      id: "m_3",
      timestamp: Date.now() - 79999
    }]));
  }

};

},{}],4:[function(require,module,exports){
"use strict";

var MeetgunDispatcher = require("../dispatcher/MeetgunDispatcher.es6");
var MeetingConstants = require("../constants/MeetingConstants.es6");

var ActionTypes = MeetingConstants.ActionTypes;

module.exports = {

  receiveAll: function receiveAll(rawMeetings) {
    MeetgunDispatcher.dispatch({
      type: ActionTypes.RECEIVE_RAW_MEETINGS,
      rawMeetings: rawMeetings
    });
  },

  receiveCreatedMeeting: function receiveCreatedMeeting(createdMeeting) {
    MeetgunDispatcher.dispatch({
      type: ActionTypes.RECEIVE_RAW_MEETINGS,
      rawMeetings: [createdMeeting]
    });
  }

};

},{"../constants/MeetingConstants.es6":9,"../dispatcher/MeetgunDispatcher.es6":10}],5:[function(require,module,exports){
"use strict";

var MeetingSection = require("./MeetingSection.react.es6");
var React = require("react");

var MeetgunApp = React.createClass({
  displayName: "MeetgunApp",

  render: function render() {
    return React.createElement("div", { className: "meetingapp" }, React.createElement(MeetingSection, null));
  }

});

module.exports = MeetgunApp;

},{"./MeetingSection.react.es6":7,"react":"react"}],6:[function(require,module,exports){
"use strict";

var React = require("react");
var ReactPropTypes = React.PropTypes;

var MeetingListItem = React.createClass({
  displayName: "MeetingListItem",

  propTypes: {
    meeting: ReactPropTypes.object
  },

  render: function render() {
    var meeting = this.props.meeting;
    return React.createElement("li", { className: "meeting-list-item" }, React.createElement("div", { className: "meeting-id" }, meeting.id), React.createElement("div", { className: "meeting-id" }, meeting.name), React.createElement("div", { className: "meeting-time" }, meeting.date.toLocaleTimeString()));
  }
});

module.exports = MeetingListItem;

},{"react":"react"}],7:[function(require,module,exports){
"use strict";

var MeetingStore = require("../stores/MeetingStore.es6");
var MeetingListItem = require("./MeetingListItem.react.es6");
var NewMeetingButton = require("./NewMeetingButton.react.es6");
var _ = require("lodash");
var React = require("react");

var getStateFromStore = function getStateFromStore() {
  return {
    meetings: _(MeetingStore.getAll()).values().reverse().value()
  };
};

var getMeetingListItem = function getMeetingListItem(meeting) {
  return React.createElement(MeetingListItem, {
    key: meeting.id,
    meeting: meeting
  });
};

var MeetingSection = React.createClass({
  displayName: "MeetingSection",

  getInitialState: function getInitialState() {
    return getStateFromStore();
  },

  componentDidMount: function componentDidMount() {
    this._scrollToBottom();
    MeetingStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function componentWillUnmount() {
    MeetingStore.removeChangeListener(this._onChange);
  },

  render: function render() {
    var meetingListItems = this.state.meetings.map(getMeetingListItem);
    return React.createElement("div", { className: "meeting-section" }, React.createElement(NewMeetingButton, null), React.createElement("ul", { className: "meeting-list", ref: "meetingList" }, meetingListItems));
  },

  componentDidUpdate: function componentDidUpdate() {
    this._scrollToBottom();
  },

  _scrollToBottom: function _scrollToBottom() {
    var ul = this.refs.meetingList.getDOMNode();
    ul.scrollTop = ul.scrollHeight;
  }

  /**
   * Event handler for 'change' events coming from the MessageStore
   */
  , _onChange: function _onChange() {
    this.setState(getStateFromStore());
  }
});

module.exports = MeetingSection;

},{"../stores/MeetingStore.es6":11,"./MeetingListItem.react.es6":6,"./NewMeetingButton.react.es6":8,"lodash":"lodash","react":"react"}],8:[function(require,module,exports){
"use strict";

var React = require("react");
var MeetingWebAPIUtils = require("../utils/MeetingWebAPIUtils.es6");

var MeetingListItem = React.createClass({
  displayName: "MeetingListItem",

  createMeeting: function createMeeting() {
    MeetingWebAPIUtils.saveNewMeeting();
  },
  render: function render() {
    return React.createElement("button", { onClick: this.createMeeting }, "New Meeting");
  }
});

module.exports = MeetingListItem;

},{"../utils/MeetingWebAPIUtils.es6":13,"react":"react"}],9:[function(require,module,exports){
"use strict";

var keyMirror = require("keymirror");

module.exports = {
  ActionTypes: keyMirror({
    RECEIVE_RAW_MEETINGS: null,
    CREATE_MEETING: null,
    RECIEVE_RAW_CREATED_MEETING: null
  })
};

},{"keymirror":"keymirror"}],10:[function(require,module,exports){
"use strict";

var Dispatcher = require("flux").Dispatcher;

module.exports = new Dispatcher();

},{"flux":"flux"}],11:[function(require,module,exports){
"use strict";

var MeetgunDispatcher = require("../dispatcher/MeetgunDispatcher.es6");
var MeetingConstants = require("../constants/MeetingConstants.es6");
var MeetingUtils = require("../utils/MeetingUtils.es6");
var EventEmitter = require("events").EventEmitter;

var CHANGE_EVENT = "change";
var ActionTypes = MeetingConstants.ActionTypes;

var _meetings = {};

var _addMeetings = function _addMeetings(rawMeetings) {
  rawMeetings.forEach(function (meeting) {
    if (!_meetings[meeting._id]) {
      _meetings[meeting._id] = MeetingUtils.convertRawMeeting(meeting);
    }
  });
};

var MeetingStore = Object.assign({}, EventEmitter.prototype, {
  emitChange: function emitChange() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  get: function get(id) {
    return _meetings[id];
  },

  getAll: function getAll() {
    return _meetings;
  }
});

MeetingStore.dispatchToken = MeetgunDispatcher.register(function (action) {
  switch (action.type) {
    case ActionTypes.CREATE_MEETING:
      var meeting = MeetingUtils.getCreatedMeetingData();
      _meetings[meeting.id] = meeting;
      break;

    case ActionTypes.RECEIVE_RAW_MEETINGS:
      _addMeetings(action.rawMeetings);
      MeetingStore.emitChange();
      break;

    default:
    // no op
  }
});

module.exports = MeetingStore;

},{"../constants/MeetingConstants.es6":9,"../dispatcher/MeetgunDispatcher.es6":10,"../utils/MeetingUtils.es6":12,"events":2}],12:[function(require,module,exports){
"use strict";

module.exports = {
  convertRawMeeting: function convertRawMeeting(rawMeeting) {
    return {
      id: rawMeeting._id,
      name: rawMeeting.properties.name,
      date: new Date(rawMeeting.properties.timestamp) };
  },

  getCreatedMeetingData: function getCreatedMeetingData() {
    var timestamp = Date.now();
    return {
      id: "m_" + timestamp,
      date: new Date(timestamp)
    };
  }
};

},{}],13:[function(require,module,exports){
"use strict";

var MeetingServerActionCreators = require("../actions/MeetingServerActionCreators.es6");
var $ = require("jquery");
var q = require("q");

// !!! Please Note !!!
// We are using localStorage as an example, but in a real-world scenario, this
// would involve XMLHttpRequest, or perhaps a newer client-server protocol.
// The function signatures below might be similar to what you would build, but
// the contents of the functions are just trying to simulate client-server
// communication and server-side processing.

module.exports = {

  saveNewMeeting: function saveNewMeeting() {
    q.spawn(regeneratorRuntime.mark(function callee$1$0() {
      var meeting;
      return regeneratorRuntime.wrap(function callee$1$0$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            context$2$0.next = 2;
            return $.post("/api/meetings/create", { timestamp: Date.now() });

          case 2:
            meeting = context$2$0.sent;

            MeetingServerActionCreators.receiveCreatedMeeting(meeting);

          case 4:
          case "end":
            return context$2$0.stop();
        }
      }, callee$1$0, this);
    }));
  },

  getAllMeetings: function getAllMeetings() {
    q.spawn(regeneratorRuntime.mark(function callee$1$0() {
      var data;
      return regeneratorRuntime.wrap(function callee$1$0$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            context$2$0.next = 2;
            return $.get("/api/meetings");

          case 2:
            data = context$2$0.sent;

            MeetingServerActionCreators.receiveAll(data);

          case 4:
          case "end":
            return context$2$0.stop();
        }
      }, callee$1$0, this);
    }));
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

};

},{"../actions/MeetingServerActionCreators.es6":4,"jquery":"jquery","q":"q"}]},{},[1]);
