// Include packages and DB related variables
const mongoose = require('mongoose')
const Schema = mongoose.Schema

// add new Schema
const categorySchema = new Schema({
  title: {
    type: String,
    trim: true,
    required: true
  },
  icon: {
    type: String,
    trim: true,
    required: true
  },
  records: [{
    type: Schema.Types.ObjectId,
    ref: 'Record'
  }]
})

// Export module
module.exports = mongoose.model('Category', categorySchema)
