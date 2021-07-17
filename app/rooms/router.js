var router = require('express').Router()
var {createRoom,joinRoom} = require('./room.js')

router.get('/create-room',createRoom);
router.get('/join-room',joinRoom);

module.exports=router;