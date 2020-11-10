const express = require('express')
const router = express.Router()

const home = require('./modules/home')
const records = require('./modules/records')
const users = require('./modules/users')

const { authenticator } = require('../middleware/auth')

router.use('/records', authenticator, records) // routes to CRUD records
router.use('/users', users)     // routes to login/register/logout
router.use('/', authenticator, home)           // route of home page

module.exports = router
