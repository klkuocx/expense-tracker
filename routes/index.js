const express = require('express')
const router = express.Router()

// route of home page
const home = require('./modules/home')
router.use('/', home)

// routes to CRUD records
const records = require('./modules/records')
router.use('/records', records)

module.exports = router
