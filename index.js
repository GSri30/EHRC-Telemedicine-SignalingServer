var {EVENTS,URIS} = require('./Constants.js');

const app = require('express')();

let fs = require('fs');
const options = {
    key: fs.readFileSync('encryption/key.pem'),
    cert: fs.readFileSync('encryption/cert.pem')
};
const https = require('https').createServer(options, app);

const io = require('socket.io')(https,{
    cors: {
        origins: ['http://localhost:4200']
      }
});

const { v4: uuidv4 } = require('uuid');

app.get(URIS.CREATE_ROOM, (req, res) => {
    let newUUID = uuidv4();
    return res.json({
        'room-id': newUUID
    });
});

app.get(URIS.JOIN_ROOM, (req, res) => {
    let roomId = req.query['roomId'];
    if(io.sockets.adapter.rooms.has(roomId) === true) {
        return res.status(200).send('Everything Cool !');
    }
    else {
        return res.status(400).send('No Room with such an ID');
    }
});


io.on(EVENTS.CONNECT, (socket) => {
    console.log(`New User Connected : ${socket.id}`);
    socket.on(EVENTS.JOIN, (data) => {
        if(io.sockets.adapter.rooms.has(data['room-id']) === true) {
            socket.join(data['room-id']);
            socket.broadcast.in(data['room-id']).emit('room-joined', data);
        }
        else {
            socket.join(data['room-id']);
        }
    });

    socket.on(EVENTS.SEND_METADATA, (data) => {
        socket.to(data['peer-id']).emit('send-metadata', data);
    });

    socket.on(EVENTS.ICE_CANDIDATE, (data) => {
        socket.to(data['peer-id']).emit('ice-candidate', data);
    });

    socket.on(EVENTS.OFFER, (data) => {
        socket.to(data['peer-id']).emit('offer', data);
    });

    socket.on(EVENTS.ANSWER, (data) => {
        socket.to(data['peer-id']).emit('answer', data);
    });

    socket.on(EVENTS.DISCONNECT, (reason) => {
        console.log(`User Disconnected : ${socket.id}`);
        socket.broadcast.emit('client-disconnected', { 'client-id': socket.id });
    });
});

const port = process.env.PORT || 3000;

https.listen(port, () => {
    console.log(`Express server listening on port ${port}`);
});
