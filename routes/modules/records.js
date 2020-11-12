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
      record.userId = req.user._id
      Record.create(record)
        .then(record => {
          category.records.push(record._id)
          category.save()
        })
        .then(() => {
          req.flash('success_msg', 'Record created successfully!')
          res.redirect('/')
        })
        .catch(error => console.error(error))
    })
    .catch(error => console.error(error))
})

// Set routes to edit record
router.get('/:_id/edit', (req, res) => {
  const { _id } = req.params
  const userId = req.user._id
  Record.findOne({ _id, userId })
    .populate('category')
    .lean()
    .then(record => {
      record.date = record.date.toISOString().slice(0, 10)
      Category.find({ _id: { $ne: record.category._id } })
        .lean()
        .sort({ _id: 'asc' })
        .then(categories => res.render('edit', { record, categories }))
        .catch(error => console.error(error))
    })
    .catch(error => console.error(error))
})

router.put('/:_id', (req, res) => {
  const { _id } = req.params
  const userId = req.user._id
  const update = req.body
  // remove this record from old category
  Record.findOne({ _id, userId })
    .then(record => {
      Category.findById(record.category)
        .then(category => {
          category.records = category.records.filter(record => record.toString() !== _id)
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
      Record.findOneAndUpdate({ _id, userId }, update, { new: true })
        .then(record => {
          category.records.push(record._id)
          category.save()
        })
        .then(() => {
          req.flash('success_msg', 'Record updated successfully!')
          res.redirect(`/`)
        })
        .catch(error => console.error(error))
    })
    .catch(error => console.error(error))
})

// Set routes to delete record
router.delete('/:_id', (req, res) => {
  const { _id } = req.params
  const userId = req.user._id

  Record.findOne({ _id, userId })
    .then(record => {
      Category.findById(record.category)
        // remove record from collection of category
        .then(category => {
          category.records = category.records.filter(record => record.toString() !== _id)
          category.save()
        })
        .catch(error => console.error(error))

      // delete this record
      record.remove()
    })
    .then(() => {
      req.flash('success_msg', 'Record deleted successfully!')
      res.redirect('/')
    })
    .catch(error => console.error(error))
})

// Set routes to filter, search record
router.get('/', (req, res) => {
  const { filteredCategory, startDate, endDate, keyword, sort } = req.query
  const userId = req.user._id
  const sortObj = JSON.parse(sort)

  Category.find()
    .lean()
    .sort({ _id: 'asc' })
    .then(categories => {
      // checked select options
      let checkedCategories = []
      let otherCategories = []
      categories.forEach(category => {
        if (filteredCategory.includes(category._id.toString())) {
          checkedCategories.push(category)
        } else {
          otherCategories.push(category)
        }
      })

      Record.find({
        userId,
        category: filteredCategory,
        date: { $gte: startDate, $lte: endDate } // filter within a range of dates
      })
        .populate('category')
        .lean()
        .sort(sortObj)
        .then(records => {
          // search keyword
          if (keyword) {
            records = records.filter(record => record.name.toLowerCase().includes(keyword.trim().toLowerCase()))
          }

          // checked total amount & transform time string
          let totalAmount = 0
          records.forEach(record => {
            record.date = record.date.toISOString().slice(0, 10)
            totalAmount += record.amount
          })

          // render records
          res.render('index', { records, totalAmount, checkedCategories, otherCategories, startDate, endDate, keyword, sort })
        })
        .catch(error => console.error(error))
    })
    .catch(error => console.error(error))
})

module.exports = router
