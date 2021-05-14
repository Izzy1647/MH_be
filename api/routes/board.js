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
 * post a msg to the board
 */
router.post('/', checkAuth, (req, res, next) => {
  const userData = req.userData
  const boardMsg = new Board({
    _id: new mongoose.Types.ObjectId(),
    name: userData.name,
    number: userData.number,
    message: req.body.message,
  })
  boardMsg
    .save()
    .then((result) =>
      res.status(200).json({ msg: 'Successfully posted msg on board', result })
    )
    .catch((err) => res.status(500).json({ err }))
})

/**
 * delete a msg by msgId
 */
 router.delete('/:msgId', (req, res, next) => {
  Board.remove({ _id: req.params.msgId })
    .exec()
    .then((result) => {
      res.status(400).json({ msg: 'Successfully deleted msg.' })
    })
    .catch((err) => {
      console.log('delete msg error:', err)
      res.status(500).json({ msg: 'error' })
    })
})

module.exports = router
