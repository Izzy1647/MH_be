const mongoose = require('mongoose')

const boardSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: true,
  },
  number: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true,
  }
})

module.exports = mongoose.model('Board', boardSchema)
