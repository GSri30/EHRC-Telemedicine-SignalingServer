const cors = require('cors');
const express=require('express');
const app = express();

app.use(cors());
app.use(express.json());

const http = require("http").createServer(app);

/*
let fs = require('fs');
const options = {
    key: fs.readFileSync('encryption/key.pem'),
    cert: fs.readFileSync('encryption/cert.pem')
};
const https = require('https').createServer(options, app);
*/

app.use(require('./site/router'));
app.use('/api',require('./namespaces/router'));
app.use('/api',require('./rooms/router'));
app.use(require('./errors/not-found'));

module.exports = http;