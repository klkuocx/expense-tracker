// Include packages
const express = require('express')
const exphbs = require('express-handlebars')
const hbshelpers = require('handlebars-helpers')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

// Define variables related to server and database
const routes = require('./routes')
require('./config/mongoose')
const app = express()
const PORT = process.env.PORT || 3000

// Set view engine
app.engine('hbs', exphbs({ helpers: hbshelpers(), defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

// Set middleware
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

// Set the routes
app.use(routes)

// Listen to server
app.listen(PORT, () => {
  console.log(`Express server is running on http://localhost:${PORT}`)
})
