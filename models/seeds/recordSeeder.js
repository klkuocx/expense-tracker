// Include packages and DB related variables
const mongoose = require('mongoose')
const Record = require('../record')
const Category = require('../category')

// Connect to MongoDB
mongoose.connect('mongodb://localhost/expense-tracker', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', () => {
  console.error('MongoDB error 0_0')
})
db.once('open', () => {
  console.log('MongoDB connected =)')

  createRecords()

  console.log('recordSeeder.js done ^_^')
})

function createRecords() {
  Category.find()
    .then(categories => {
      const categoriesId = []
      categories.forEach(category => {
        categoriesId.push(category._id)
      })
      return categoriesId
    })
    .then(id => {
      for (let i = 0; i < 5; i++) {
        Record.create({
          name: `name-${i}`,
          category: id[i],
          date: `2020-09-0${i + 1}`,
          amount: (i + 1) * 100
        })
          .then(record => {
            Category.findById(id[i])
              .then(category => {
                category.records.push(record._id)
                category.save()
              })
          })
      }
    })
    .catch(error => console.error(error))
}
