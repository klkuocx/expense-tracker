const express = require('express')
const router = express.Router()

const Record = require('../../models/record')
const Category = require('../../models/category')

// Set route to home
router.get('/', (req, res) => {
  Category.find()
    .lean()
    .sort({ _id: 'asc' })
    .then(categories => {
      Record.find()
        .populate('category')
        .lean()
        .sort({ _id: 'asc' })
        .then(records => {
          let totalAmount = 0
          records.forEach(record => totalAmount += record.amount)
          res.render('index', { records, totalAmount, categories })
        })
        .catch(error => console.error(error))
    })
    .catch(error => console.error(error))
})

module.exports = router
