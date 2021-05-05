const express = require('express')
const mongoose = require('mongoose')
const Mail = require('../models/mail')
const checkAuth = require('../middleware/check-auth')
const router = express.Router()

/**
 * get all mails
 */
router.get('/', (req, res, next) => {
  Mail.find()
    .exec()
    .then((result) => {
      res.status(200).json({ result })
    })
    .catch((err) => res.status(500).json({ err }))
})

/**
 * post a mail
 */
router.post('/', checkAuth, (req, res, next) => {
  const userData = req.userData
  const mail = new Mail({
    _id: new mongoose.Types.ObjectId(),
    from: userData.userId,
    message: req.body.message,
  })
  mail
    .save()
    .then((result) =>
      res.status(200).json({ msg: 'Successfully sent mail', result })
    )
    .catch((err) => res.status(500).json({ err }))
})

/**
 * reply a mail by mailId (update the mail with reply field)
 */
router.post('/reply/:mailId', (req, res, next) => {
  const mailId = req.params.mailId
  Mail.findByIdAndUpdate(
    mailId,
    { $set: { reply: req.body.reply } },
    { new: true }
  )
    .then((result) =>
      res.status(200).json({
        msg: 'Successfully replied',
        result,
      })
    )
    .catch((err) => res.status(500).json({ error: err }))
  // Mail.findById(mailId)
  //   .exec()
  //   .then((result) => {
  //     res.status(200).json({ result })
  //   })
  //   .catch((err) => res.status(500).json({ err }))
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
      console.log('delete reservation error:', err)
      res.status(500).json({ msg: 'error' })
    })
})

module.exports = router
