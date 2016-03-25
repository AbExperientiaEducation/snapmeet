# Snapmeet Server
Snapmeet is a single monolith server that performs the following functions
1. Serve the snapmeet SPA assets to users.
2. Create user sessions for serving tailored content.
3. Set up socket.io server for realtime communication. 
4. Handle API requests to retrieve/modify resources (handled over socket.io connection)
5. Set up a ShareJS server to generate and store operational transforms for realtime document editing
6. Communicate with 3rd party ICE/STUN/TURN provider and relay connection information to clients.

## Page server
Snapmeet is a single page app. Our express server only ever serves a single html file; index.html. This file has references to our assets generated through the build process.  The page server serves up these assets from the /public directory.

## User Sessions
There are few user authorization restrictions in Snapmeet, by design. Anyone that knows the URL for a meeting page can access that resource and its related content.

The primary purpose of user sessions is to store a list of meetings a user has created or accessed so they can easily return to them on a subsequent visit.

We use express-session and passport to manage user sessions. Sessions are stored in Mongo.  While we have some code in our codebase around username and passwords, that functionality is currently not active; all sessions are anonymous. 

## Socket.io Server
Most Snapmeet content is intended to be pushed to the client for realtime updates/consistency. We create a socket.io server and attach it to our webserver for all client/server communications after the initial page load.

## Resource API Communication
On initialization we register a series of endpoints with our socket.io server by specifying a resource type, and a callback to be invoked if the socket.io server receives a message involving that resource.

Whenever our socket server receives a message of type `REST_ACTION`, it inspects the message and invokes the callback for the appropriate resource type.

After processing the message, the handler returns a response, which the socket.io server uses to determine how best to update clients.

For non-modifying requests (GET), only the initiating client receives the handler response. For requests that modify a resource, the socketio server also broadcasts the change to any subscribed clients.

Clients announce their intention to subscribe to resource updates as an optional parameter when making a request for that resource. As mentioned in the User Session section, we currently allow any user to access any resource.

## Collaborative Document Processing and Storage
We use the ShareJS library to manage realtime collaborative documents. We have three types of realtime documents:
1. Plain text meeting titles
2. Plain text task titles
3. Rich text meeting notes

Our custom logic for maintaining these documents lives in SyncDocHandling.es6 

We pass our mongo store to ShareJS, then listen for connect events on the socket.io server. Any time we detect a new socket we create a new duplex stream for interfacing with ShareJS. Browser client ShareJS events are passed through to the ShareJS server, while events generated in ShareJS are passed back to the browser client.

Logic for maintaining cursor position also lives in SyncDocHandling.es6, though it is a simple pub/sub through socket.io, and is not routed through ShareJS.

## WebRTC Connection Mediation

WebRTC is a peer-peer technology, but it depends on there being a 3rd party server to assist in peer discovery. In our case, a peer connects to a STUN server, which is used to determine potential IP/port pairs the peer can be reached at. This will depend on the client NAT configuration. These addresses are referred to as "ICE candidates".

We use XirSys as our STUN server; when a user requests a video conference we use their API to generate credentials and pass them to the browser client. Peers will attempt to connect to each other using the list of IP/port candidates (which we pass through our server). 