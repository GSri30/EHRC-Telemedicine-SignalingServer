# EHRC-Telemedicine-Signaling-Server

This server is made as part of the 'Telemedicine' ([Telemedicine-Frontend](https://github.com/divyamagwl/EHRC-Telemedicine-frontend#telecommunication-doctor-frontend) , [Telemedicine-Backend](https://github.com/architsangal/EHRC-Telemedicine-Backend)) application. The server handles the core communication part of the main application. 

Provides functionalities including creating, removing, checking namespaces, rooms and all other required socket events to setup the client-server arch. 

This server is also responsible for initiating a peer-to-peer connection (inits the WebRTC service) which at the basic level, provides functionality to create communication channels which can be used to stream media such as audio and video.

## Folder Structure
```bash
app/
├── config.js
├── index.js
├── io.js
├── server.js
├── data
│   └── session-data.js
├── namespaces
│   ├── namespace.js
│   └── router.js
├── rooms
│   ├── room.js
│   └── router.js
├── site
│   ├── home.js
│   └── router.js
├──socket
│    ├── events.js
│    └── socket.js
└── errors
    ├── not-found.html
    └── not-found.js
```

### HighLevel Overview

- ```config.js``` : Contains basic configuration equipped for this server such as cors, dev-production switch etc.
- ```index.js``` : Defines/inits the main http server app and includes the routes' entry-point.
- ```io.js``` : Defines/Inits socket service.
- ```server.js``` : Main entry point to the server. Calls/Uses all the services/apps/configuration defined in ```config.js```, ```index.js``` and ```io.js```.
- ```bash
    data
    └── session-data.js
  ``` 
  ```session-data.js``` handles all data the server be using to maintain the client-server connection.

- ```bash
    namespaces
    ├── namespace.js
    └── router.js
    ```
    Contains all methods handling creating, removing and checking availability of namespaces. ```namespace.js``` defines the required functions and ```router.js``` maps those functions with the corresponding routes.

- ```bash
    rooms
    ├── room.js
    └── router.js
    ```
    Contains methods defining creating and joining into the rooms. ```room.js``` defines the required functions and ```router.js``` maps those functions with the corresponding routes.

- ```bash
    site
    ├── home.js
    └── router.js
    ```
    Defines the basic home of the server.

- ```bash
    socket
    ├── events.js
    └── socket.js
    ```
    Contains all methods handling the socket service. The defined functions are used to define the main functionality in ```namespaces/namespace.js``` and ```rooms/room.js```.
    ```events.js``` defines all the events and ```socket.js``` uses the defined functions and maps them with corresponding event entry-points to define a socketHandler. ```socket.js``` also provides some other important socket functionalities.


### Routes
* ```GET '/create-namespace' ```: 
    * Params : namespaceId
    * Returns json with status code 200 on success
    * Creates a namespace with the specified namespaceId in params.
* ```GET '/remove-namespace' ```: 
    * Params : namespaceId
    * Returns json with status code 200 on success
    * Removes the specified namespace.
* ```GET '/check-availability' ```:
    * Params : namespaceId
    * Returns json with the key 'availability' and value 'true' or 'false'
    * Checks if a namespace exists with the specified namespaceId.
* ```GET '/create-room' ```: 
    * Returns json with 'room-id', a unique-random uuid.
    * Creates a room and returns its id.
* ```GET '/join-room' ```: 
    * Params : roomId
    * Returns json with status code 200 on success.
    * Joins the room having the specified roomId.

## Version Supported
- node-version: 12.x, 14.x, 16.x

## Installation

- ```npm install```
- ```npm run dev``` to run the server on nodemon or 
```npm start``` to run normally.

## Entry Point

app/server.js

## Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/GSri30/EHRC-Telemedicine-SignalingServer/issues). 

## License

This project is [MIT](https://github.com/GSri30/EHRC-Telemedicine-SignalingServer/blob/main/LICENSE) licensed.
