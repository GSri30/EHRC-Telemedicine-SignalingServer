const {SessionData} = require('../data/session-data');

const {doctor_joined,join,ack_doctor_entered,create,ice_candidate,offer,answer,disconnect,send_metadata,rejected,patientLeft,doctorEnded,patientEnded} = require('./events');

function socketHandler(socket) {

    socket.on('doctor-joined', (data) => {doctor_joined(data);});
    
    socket.on('join', (data) => {join(data,socket)});

    socket.on('ack-doctor-entered',(data) => {ack_doctor_entered(data,socket)});

    socket.on('create', (data) => {create(data,socket)});
    
    socket.on('send-metadata', (data) => {send_metadata(data,socket)});

    socket.on('ice-candidate', (data) => {ice_candidate(data,socket)});

    socket.on('offer', (data) => {offer(data,socket)});

    socket.on('answer', (data) => {answer(data,socket)});

    socket.on('disconnect', (data) => {disconnect(data,socket)});

    socket.on('doctor-rejected', (data) => {rejected(data,socket)});
    
    socket.on('patient-left', (data) => {patientLeft(data,socket)});

    socket.on('doctor-ended', (data) => {doctorEnded(data,socket)});

    socket.on('patient-ended', (data) => {patientEnded(data,socket)});
}

function contains_room(room_id){
    if(SessionData.io.sockets.adapter.rooms.has(room_id)){
        return true;
    }
    return false;
}

function contains_namespace(namespace_id){
    if(SessionData.io._nsps.has(`/${namespace_id}`)){
        return true;
    }
    return false;
}

function create_namespace(namespace_id){
    const namespace = SessionData.io.of(`/${namespace_id}`);
    namespace.on('connect', socketHandler);
    SessionData.setNamespace(namespace_id,namespace);
}

function remove_namespace(namespace_id){
    SessionData.removeNamespace(namespace_id);
    SessionData.removeSocketNamespace(namespace_id);
    SessionData.io._nsps.delete(`/${namespace_id}`);
}

function check_availability(namespace_id){
    if(SessionData.getSocketNamespace(namespace_id)){
        return true;
    }
    return false;
}

module.exports={socketHandler,contains_room,contains_namespace,create_namespace,remove_namespace,check_availability};