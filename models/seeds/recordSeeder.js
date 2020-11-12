if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
// Include packages and DB related variables
const bcrypt = require('bcryptjs')
const Record = require('../record')
const Category = require('../category')
const User = require('../user')
const db = require('../../config/mongoose')
const SEED_USER = {
  name: 'root',
  email: 'root@example.com',
  password: '12345678'
}

// Generate record seed
db.once('open', () => {
  bcrypt
    .genSalt(10)
    .then(salt => bcrypt.hash(SEED_USER.password, salt))
    .then(hash => User.create({
      name: SEED_USER.name,
      email: SEED_USER.email,
      password: hash
    }))
    .then(user => {
      const userId = user._id
      return Category.find()
        .lean()
        .sort({ _id: 'asc' })
        .then(categories => categories.map(category => category._id))
        .then(categoriesId => {
          const SEED_RECORDS = []
          for (let month = 0; month < 12; month++) {
            for (let i = 1; i < 11; i++) {
              const date = new Date
              date.setMonth(month)
              date.setDate(i)

              SEED_RECORDS.push({
                name: `record-${month + 1}-${i}`,
                category: categoriesId[i % 5],
                date,
                amount: i * 100,
                merchant: `merchant-${month + 1}-${i}`,
                userId
              })
            }
          }
          return SEED_RECORDS
        })
        .then(records => Record.create(records))
        .catch(error => console.error(error))
    })
    .then(() => {
      console.log('recordSeeder.js done ^_^')
      process.exit()
    })
})
