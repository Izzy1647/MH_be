const mongoose = require('mongoose')

const mailSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  from: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  reply: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    required: true,
  }
})

module.exports = mongoose.model('Mail', mailSchema)
