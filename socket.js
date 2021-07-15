const {SessionData}=require('./session-data.js');

function socketHandler(socket) {

    socket.on('doctor-joined', (data) => {
        // socket_namespace[data['namespace-id']] = data['client-id'];
        SessionData.setSocketNamespace(data['namespace-id'],data['client-id']);
    });
    
    socket.on('join', (data) => {
        if (SessionData.io._nsps.get(socket.nsp.name).adapter.rooms.has(data['room-id']) === true) {
            if(data['init']) socket.to(data['room-id']).emit('doctor-entered',data),console.log("doctor join init true : 8");
            // if(data['init']) socket.to(data['room-id']).emit('doctor-entered',data),console.log("doctor join : 8");
            else socket.join(data['room-id']),socket.broadcast.in(data['room-id']).emit('room-joined', data),console.log("doctor join init false : 13");
        }

    });

    socket.on('ack-doctor-entered',(data)=>{
        console.log("ack-doctor-entered-server : 11");
        // socket.broadcast.in(data['room-id']).emit('room-joined', data);
        socket.to(data['client-id']).emit('ack-doctor-entered', data);
    })

    // socket.on('allow-patient',(data)=>{
    //     socket.to(data['room-id']).emit('start-video');
    // });

    // socket.on('patient-entered')

    socket.on('create', (data) => {
        socket.join(data['room-id']);
        // const doc_socket_id = socket_namespace[socket.nsp.name.slice(1)];
        const doc_socket_id = SessionData.getSocketNamespace(socket.nsp.name.slice(1));
        if(doc_socket_id){
            console.log("new-patient-server : 3");
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

module.exports={socketHandler};