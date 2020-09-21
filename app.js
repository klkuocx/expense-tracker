// Include packages and define app related variables
const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const hbshelpers = require('handlebars-helpers')
const bodyParser = require('body-parser')

const Record = require('./models/record')
const Category = require('./models/category')
const category = require('./models/category')

const app = express()
const port = 3000

// Connect to MongoDB
mongoose.connect('mongodb://localhost/expense-tracker', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
const db = mongoose.connection
db.on('error', () => {
  console.error('MongoDB error 0_0')
})
db.once('open', () => {
  console.log('MongoDB connected =)')
})

// Set view engine
app.engine('hbs', exphbs({ helpers: hbshelpers(), defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

// Set middleware
app.use(bodyParser.urlencoded({ extended: true }))

// Set route to home
app.get('/', (req, res) => {
  Record.find()
    .populate('category')
    .lean()
    .sort({ _id: 'asc' })
    .then(records => res.render('index', { records }))
    .catch(error => console.error(error))
})

// Set route to create new record
app.get('/records/new', (req, res) => {
  Category.find()
    .lean()
    .sort({ _id: 'asc' })
    .then(categories => res.render('new', { categories }))
    .catch(error => console.error(error))
})

app.post('/records/new', (req, res) => {
  const record = req.body
  Category.findOne({ title: record.category })
    .then(category => {
      record.category = category._id

      Record.create(record)
        .then(record => {
          category.records.push(record._id)
          category.save()
        })
        .then(() => res.redirect('/'))
        .catch(error => console.error(error))
    })
    .catch(error => console.error(error))
})

// Set routes to edit record
app.get('/records/:id/edit', (req, res) => {
  let categories = []
  Category.find()
    .lean()
    .sort({ _id: 'asc' })
    .then(all => categories = all)
    .catch(error => console.error(error))

  const id = req.params.id
  Record.findById(id)
    .populate('category')
    .lean()
    .then(record => res.render('edit', { record, categories }))
    .catch(error => console.error(error))
})

app.post('/records/:id/edit', (req, res) => {
  const id = req.params.id
  const update = req.body
  // remove this record from old category
  Record.findById(id)
    .then(record => {
      Category.findById(record.category)
        .then(category => {
          category.records = category.records.filter(record => record.toString() !== id)
          category.save()
        })
    })

  // assign category id in update object
  Category.findOne({ title: update.category })
    .then(category => {
      update.category = category._id

      // update record
      Record.findByIdAndUpdate(id, update, { new: true })
        .then(record => {
          category.records.push(record._id)
          category.save()
        })
        .then(() => res.redirect(`/`))
        .catch(error => console.error(error))
    })
    .catch(error => console.error(error))
})

// Listen to server
app.listen(port, () => {
  console.log(`Express server is running on http://localhost:${port}`)
})
