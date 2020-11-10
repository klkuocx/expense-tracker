const express = require('express')
const router = express.Router()

const home = require('./modules/home')
const records = require('./modules/records')
const users = require('./modules/users')

router.use('/records', records) // routes to CRUD records
router.use('/users', users)     // routes to login/register/logout
router.use('/', home)           // route of home page

module.exports = router
