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
          req.flash('success_msg', `[${record.name}] created successfully!`)
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
      record.date = record.date.toISOString().slice(0, 10) // for Date input value
      Category.find({ _id: { $ne: record.category._id } }) // for categories options
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

  // assign category id in update object
  Category.findOne({ title: update.category })
    .then(category => {
      update.category = category._id

      // update record
      Record.findOneAndUpdate({ _id, userId }, update, { new: true })
        .then(record => {
          req.flash('success_msg', `[${record.name}] updated successfully!`)
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

  Record.findOneAndDelete({ _id, userId })
    .then(record => {
      req.flash('success_msg', `[${record.name}] already deleted!`)
      res.redirect('/')
    })
    .catch(error => console.error(error))
})

// Set routes to filter, search record
router.get('/', (req, res) => {
  const { filteredCategory, startDate, endDate, keyword, sort } = req.query
  const userId = req.user._id

  Category.find()
    .lean()
    .sort({ _id: 'asc' })
    .then(categories => {
      // checked select options
      let checkedCategories = []
      let otherCategories = []
      categories.forEach(category => {
        if (filteredCategory.includes(category.title)) {
          checkedCategories.push(category)
        } else {
          otherCategories.push(category)
        }
      })

      Record.find({
        userId,
        category: checkedCategories.map(category => category._id), // filter by categories
        date: { $gte: startDate, $lte: endDate } // filter within a range of dates
      })
        .populate('category')
        .lean()
        .sort(JSON.parse(sort))
        .then(records => {
          // search by keyword
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
