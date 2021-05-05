const mongoose = require('mongoose')

const reservationSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  studentName: {
    type: String,
    required: true
  },
  number: {
    type: String,
    required: true
  },
  teacherName: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  message: {
    type: String,
    default: ' '
  }
})

module.exports = mongoose.model('Reservation', reservationSchema)
