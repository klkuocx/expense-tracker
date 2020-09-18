// Include packages and define app related variables
const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')

const Record = require('./models/record')
const Category = require('./models/category')

const app = express()
const port = 3000

// Connect to MongoDB
mongoose.connect('mongodb://localhost/expense-tracker', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', () => {
  console.error('MongoDB error 0_0')
})
db.once('open', () => {
  console.log('MongoDB connected =)')
})

// Set view engine
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

// Set routes
app.get('/', (req, res) => {
  Record.find()
    .populate('category')
    .lean()
    .then(records => res.render('index', { records }))
    .catch(error => console.error(error))
})

// Listen to server
app.listen(port, () => {
  console.log(`Express server is running on http://localhost:${port}`)
})
