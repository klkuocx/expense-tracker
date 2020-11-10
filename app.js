// Include packages
const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const useExphbs = require('./config/exphbs')
const methodOverride = require('method-override')
const usePassport = require('./config/passport')

// Define variables related to server and database
const routes = require('./routes')
require('./config/mongoose')
const app = express()
const PORT = process.env.PORT || 3000

// Set middleware
useExphbs(app)
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(session({
  secret: 'WhySoSerious',
  resave: false,
  saveUninitialized: true
}))
usePassport(app)
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  next()
})

// Set the routes
app.use(routes)

// Listen to server
app.listen(PORT, () => {
  console.log(`Express server is running on http://localhost:${PORT}`)
})
