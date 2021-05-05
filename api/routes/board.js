const express = require('express')
const mongoose = require('mongoose')
const Board = require('../models/board')
const checkAuth = require('../middleware/check-auth')
const router = express.Router()

/**
 * get all board messages
 */
router.get('/', (req, res, next) => {
  Board.find()
    .exec()
    .then((result) => {
      res.status(200).json({ result })
    })
    .catch((err) => res.status(500).json({ err }))
})

/**
 * post a reservation
 */
router.post('/', checkAuth, (req, res, next) => {
  const userData = req.userData
  const reservation = new Reservation({
    _id: new mongoose.Types.ObjectId(),
    studentName: userData.name,
    number: userData.number,
    teacherName: req.body.teacherName,
    time: req.body.time,
    message: req.body.message,
  })
  reservation
    .save()
    .then((result) =>
      res.status(200).json({ msg: 'Successfully reserved', result })
    )
    .catch((err) => res.status(500).json({ err }))
})

/**
 * delete a reservaton by reservationId
 */
router.delete('/:reservationId', checkAuth, (req, res, next) => {
  Reservation.remove({ _id: req.params.reservationId })
    .exec()
    .then((result) => {
      res.status(400).json({ msg: 'Successfully deleted reservation.' })
    })
    .catch((err) => {
      console.log("delete reservation error:", err)
      res.status(500).json({ msg: 'error' })
    })
})

module.exports = router
