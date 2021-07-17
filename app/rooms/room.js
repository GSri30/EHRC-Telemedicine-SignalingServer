var { v4: uuidv4 } = require('uuid');
const { contains_room } = require('../socket/socket');

function createRoom(req,res){
    let newUUID = uuidv4();
    
    return res.json({
        'room-id': newUUID
    });
}

function joinRoom(req,res){
    let room_id = req.query['roomId'];
    
    if(contains_room(room_id)) {
        return res.status(200).send('Everything Cool !');
    }
    else {
        return res.status(400).send('No Room with such an ID');
    }
}

module.exports={createRoom,joinRoom};