var router = require('express').Router()
var {home} = require('./home.js')

router.get('/',home);

module.exports = router