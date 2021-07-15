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

const {socketHandler} =require('./socket.js')
const {SessionData}=require('./session-data.js');
SessionData.setIO(io);


app.use(express.json());

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
        SessionData.setNamespace(namespace_id,namespace);
        // namespaces[namespace_id] = namespace;
        return res.json({
            'status': 200,
            'msg': 'Namespace added successfully.'
        });
    }
});

app.get(URIS.REMOVE_NAMESPACE, (req, res) => {
    let namespace_id = req.query['namespace_id'];
    SessionData.removeNamespace(namespace_id);
    SessionData.removeSocketNamespace(namespace_id);
    // delete namespaces[namespace_id];
    // delete socket_namespace[namespace_id];
    io._nsps.delete(`/${namespace_id}`);
    return res.json({
        'status': 200,
        'msg': 'Namespace removed successfully'
    });
});

app.get(URIS.CHECK_AVAILABILITY, (req, res) => {
    let namespace_id = req.query['namespace_id'];
    if(SessionData.getSocketNamespace(namespace_id)){
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






// Temp funcs

var waitingListPatient;

app.post('/addPatientusers/addtowaitlist/',(req,res)=>{
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