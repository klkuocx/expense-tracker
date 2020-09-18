// Include packages and define app related variables
const express = require('express')
const mongoose = require('mongoose')

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

// Set routes
app.get('/', (req, res) => {
  res.send('expense tracker app coming soon!')
})

// Listen to server
app.listen(port, () => {
  console.log(`Express server is running on http://localhost:${port}`)
})
