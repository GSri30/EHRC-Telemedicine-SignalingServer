const {SessionData} = require('../data/session-data');

function doctor_joined(data){
    SessionData.setSocketNamespace(data['namespace-id'],data['client-id']);
}

function join(data,socket){
    if(SessionData.io._nsps.get(socket.nsp.name).adapter.rooms.has(data['room-id']) === true) {
        if(data['init']){
            socket.to(data['room-id']).emit('doctor-entered',data);
        }
        else{
            socket.join(data['room-id']);
            socket.broadcast.in(data['room-id']).emit('room-joined', data);
        }
    }
}

function ack_doctor_entered(data,socket){
    socket.to(data['client-id']).emit('ack-doctor-entered', data);
}

function create(data,socket){
    socket.join(data['room-id']);
    const doc_socket_id = SessionData.getSocketNamespace(socket.nsp.name.slice(1));
    if(doc_socket_id){
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
    socket.broadcast.emit('client-disconnected', { 'client-id': socket.id, 'room-id':data['room-id'] });
}

function rejected(data,socket){
    socket.to(data['roomID']).emit('rejected',data);
}

function patientLeft(data,socket){
    socket.broadcast.emit('patient-remove', {'patientID':data['patientID'] });
}

function doctorEnded(data,socket){
    socket.broadcast.emit('doctor-ended', {'patientID':data['patientID'] });
}

function patientEnded(data,socket){
    socket.broadcast.emit('patient-ended', {'patientID':data['patientID'] });
}

module.exports = {doctor_joined,join,ack_doctor_entered,create,ice_candidate,offer,answer,disconnect,send_metadata,rejected,patientLeft,doctorEnded,patientEnded}
