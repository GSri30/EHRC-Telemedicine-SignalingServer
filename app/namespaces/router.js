var router = require('express').Router()
var {createNamespace,removeNamespace,checkAvailability} = require('./namespace.js')

router.get('/create-namespace', createNamespace);
router.get('/remove-namespace', removeNamespace);
router.get('/check-availability', checkAvailability);

module.exports = router