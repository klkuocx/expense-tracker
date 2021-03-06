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
    type: Date,
    default: Date.now
  },
  amount: {
    type: Number,
    min: [1, 'at least one dollar'],
    required: true
  },
  merchant: {
    type: String,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    required: true
  }
})

// Export module
module.exports = mongoose.model('Record', recordSchema)
