// Include packages and DB related variables
const mongoose = require('mongoose')
const Schema = mongoose.Schema

// add new Schema
const recordSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category'
  },
  date: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    min: [1, 'at least one dollar'],
    required: true
  }
})

// Export module
module.exports = mongoose.model('Record', recordSchema)
