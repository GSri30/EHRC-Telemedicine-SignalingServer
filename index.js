var {EVENTS,URIS,URLS} = require('./Constants.js');

const express=require('express');
const app = require('express')();
const cors = require('cors');
app.use(cors());

/*
let fs = require('fs');
const options = {
    key: fs.readFileSync('encryption/key.pem'),
    cert: fs.readFileSync('encryption/cert.pem')
};
const https = require('https').createServer(options, app);
*/

const http = require("http").createServer(app);

const io = require('socket.io')(http,{
    cors: {
        origin: "*", //[URLS.FRONTEND_ENDPOINT,"http://localhost:4200/#/create-room"]
        methods:['GET','POST']
    }
});

const { v4: uuidv4 } = require('uuid');

app.use(express.json());

const namespaces = {};
const socket_namespace = {};

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

app.get(URIS.CREATE_NAMESPACE, (req, res) => {
    let namespace_id = req.query['namespace_id'];
    if (io._nsps.has(`/${namespace_id}`) === true) {
        return res.json({
            'status': 200,
            'msg': 'Namespeace already exists.'
        });
    } 
    else {
        const namespace = io.of(`/${namespace_id}`);
        namespace.on('connect', socketHandler);
        namespaces[namespace_id] = namespace;
        return res.json({
            'status': 200,
            'msg': 'Namespace added successfully.'
        });
    }
});

app.get(URIS.REMOVE_NAMESPACE, (req, res) => {
    let namespace_id = req.query['namespace_id'];
    delete namespaces[namespace_id];
    delete socket_namespace[namespace_id];
    io._nsps.delete(`/${namespace_id}`);
    return res.json({
        'status': 200,
        'msg': 'Namespace removed successfully'
    });
});

app.get(URIS.CHECK_AVAILABILITY, (req, res) => {
    let namespace_id = req.query['namespace_id'];
    if(socket_namespace[namespace_id]){
        return res.json({
            'status': 200,
            'msg': 'Doctor is available',
            'availability': true
        });
    }else{
        return res.json({
            'status': 200,
            'msg': 'Doctor is not available',
            'availability': false
        });
    }
});



function socketHandler(socket) {

    socket.on('doctor-joined', (data) => {
        socket_namespace[data['namespace-id']] = data['client-id'];
    });

    socket.on('join', (data) => {
        if (io._nsps.get(socket.nsp.name).adapter.rooms.has(data['room-id']) === true) {
            socket.join(data['room-id']);
            socket.broadcast.in(data['room-id']).emit('room-joined', data);
        }
    });

    socket.on('create', (data) => {
        socket.join(data['room-id']);
        const doc_socket_id = socket_namespace[socket.nsp.name.slice(1)];
        if(doc_socket_id){
            socket.to(doc_socket_id).emit('new-patient', data);
        }
    });
    
    socket.on('send-metadata', (data) => {
        socket.to(data['peer-id']).emit('send-metadata', data);
    });

    socket.on('ice-candidate', (data) => {
        socket.to(data['peer-id']).emit('ice-candidate', data);
    });

    socket.on('offer', (data) => {
        socket.to(data['peer-id']).emit('offer', data);
    });

    socket.on('answer', (data) => {
        socket.to(data['peer-id']).emit('answer', data);
    });

    socket.on('disconnect', (reason) => {
        socket.broadcast.emit('client-disconnected', { 'client-id': socket.id });
    });
}


// Temp funcs

var waitingListPatient;

app.post('/addPatientusers/addtowaitlist/',(req,res)=>{
    console.log(req.body);
    waitingListPatient=req.body;
    return res.json({
        'status':200,
        'message':'data must have been stored in db',
        // 'data-stored':req.body,
    })
});

app.post('/users/getwaitingpatients/',(req,res)=>{
    return res.json({
        'data':[waitingListPatient]
    })
})

const port = process.env.PORT || 3000;

http.listen(port, () => {
    console.log(`Express server listening on port ${port}`);
});