const express = require('express')
const router = express.Router()

const Record = require('../../models/record')
const Category = require('../../models/category')

// Set route to create new record
router.get('/new', (req, res) => {
  Category.find()
    .lean()
    .sort({ _id: 'asc' })
    .then(categories => res.render('new', { categories }))
    .catch(error => console.error(error))
})

router.post('/new', (req, res) => {
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
router.get('/:id/edit', (req, res) => {
  const { id } = req.params
  Record.findById(id)
    .populate('category')
    .lean()
    .then(record => {
      Category.find({ _id: { $ne: record.category._id } })
        .lean()
        .sort({ _id: 'asc' })
        .then(categories => res.render('edit', { record, categories }))
        .catch(error => console.error(error))
    })
    .catch(error => console.error(error))
})

router.put('/:id', (req, res) => {
  const { id } = req.params
  const update = req.body
  // remove this record from old category
  Record.findById(id)
    .then(record => {
      Category.findById(record.category)
        .then(category => {
          category.records = category.records.filter(record => record.toString() !== id)
          category.save()
        })
        .catch(error => console.error(error))
    })
    .catch(error => console.error(error))

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

// Set routes to delete record
router.delete('/:id', (req, res) => {
  const { id } = req.params

  Record.findById(id)
    .then(record => {
      Category.findById(record.category)
        // remove record from collection of category
        .then(category => {
          category.records = category.records.filter(record => record.toString() !== id)
          category.save()
        })
        .catch(error => console.error(error))

      // delete this record
      record.remove()
    })
    .then(() => res.redirect('/'))
    .catch(error => console.error(error))
})

// Set routes to filter, search record
router.get('/', (req, res) => {
  const { filter } = req.query
  const keyword = req.query.keyword.trim()
  const sort = req.query.sort

  Category.find()
    .lean()
    .sort({ _id: 'asc' })
    .then(categories => {
      Record.find({ category: filter })
        .populate('category')
        .lean()
        .sort({ amount: sort })
        .then(records => {
          // search keyword
          records = records.filter(record => record.name.toLowerCase().includes(keyword.toLowerCase()))

          // checked total amount
          let totalAmount = 0
          records.forEach(record => totalAmount += record.amount)

          // render records
          res.render('index', { records, totalAmount, categories, keyword, sort })
        })
        .catch(error => console.error(error))
    })
    .catch(error => console.error(error))
})

module.exports = router
