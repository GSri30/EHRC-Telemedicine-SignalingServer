var http = require('./index')
var config = require('./config');

var io = require('socket.io')(http,{
    cors:config.cors,
});

module.exports = io;