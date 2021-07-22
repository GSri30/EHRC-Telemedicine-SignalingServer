const {SessionData} = require('../data/session-data');

function doctor_joined(data){
    // socket_namespace[data['namespace-id']] = data['client-id'];
    console.log("DJ",data);
    SessionData.setSocketNamespace(data['namespace-id'],data['client-id']);
    let a = SessionData.getSocketNamespace(data['namespace-id']);
    console.log(a);
}

function join(data,socket){
    if(SessionData.io._nsps.get(socket.nsp.name).adapter.rooms.has(data['room-id']) === true) {
        if(data['init']){
            socket.to(data['room-id']).emit('doctor-entered',data);
            console.log("doctor join init true : 8");
        }
        else{
            socket.join(data['room-id']);
            socket.broadcast.in(data['room-id']).emit('room-joined', data);
            console.log("doctor join init false : 13");
        }
    }
}

function ack_doctor_entered(data,socket){
    console.log("ack-doctor-entered-server : 11");
    // socket.broadcast.in(data['room-id']).emit('room-joined', data);
    socket.to(data['client-id']).emit('ack-doctor-entered', data);
}

function create(data,socket){
    console.log("Create")
    socket.join(data['room-id']);
    // const doc_socket_id = socket_namespace[socket.nsp.name.slice(1)];
    const doc_socket_id = SessionData.getSocketNamespace(socket.nsp.name.slice(1));
    console.log(data['room-id']);
    console.log(doc_socket_id);
    if(doc_socket_id){
        console.log("new-patient-server : 3");
        socket.to(doc_socket_id).emit('new-patient', data);
    }
}

function send_metadata(data,socket){
    socket.to(data['peer-id']).emit('send-metadata', data);
}

function ice_candidate(data,socket){
    socket.to(data['peer-id']).emit('ice-candidate', data);
}

function offer(data,socket){
    socket.to(data['peer-id']).emit('offer', data);
}

function answer(data,socket){
    socket.to(data['peer-id']).emit('answer', data);
}

function disconnect(data,socket){
    console.log("disconnect",data)
    socket.broadcast.emit('client-disconnected', { 'client-id': socket.id, 'room-id':data['room-id'] });
}
function rejected(data,socket){
    console.log("rejected",data)
    socket.to(data['roomID']).emit('rejected',data);
    // socket.broadcast.emit('client-disconnected', { 'client-id': socket.id, 'room-id':data['room-id'] });
}

function patientLeft(data,socket){
    console.log("patient left",data);
    socket.broadcast.emit('patient-remove', {'namespace-id':data['namespace'] });
}
module.exports = {doctor_joined,join,ack_doctor_entered,create,ice_candidate,offer,answer,disconnect,send_metadata,rejected,patientLeft}