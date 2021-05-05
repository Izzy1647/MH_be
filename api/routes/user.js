const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/user')

const router = express.Router()

/**
 * create a new user (which means signup)
 */
router.post('/signup', (req, res, next) => {
  // firstly check whether the phone already exists
  User.find({ number: req.body.number })
    .exec()
    .then((result) => {
      if (result.length) {
        return res.status(409).json({
          msg: 'User existed already',
        })
      } else {
        // hash the password
        bcrypt.hash(req.body.password, 10, (err, encrypted) => {
          if (err) {
            return res.status(500).json({ err })
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              number: req.body.number,
              password: encrypted,
              name: req.body.name,
            })
            user
              .save()
              .then((result) => {
                console.log('post /user result:', result)
                res.status(201).json({
                  msg: 'User created',
                })
              })
              .catch((err) => {
                console.log('post /user err:', err)
                res.status(500).json({ err })
              })
          }
        })
      }
    })
})

/**
 * user login
 */
router.post('/login', (req, res, next) => {
  User.find({ number: req.body.number })
    .exec()
    .then((user) => {
      if (!user.length) {
        return res.status(401).json({ msg: 'failed' })
      }
      bcrypt.compare(req.body.password, user[0].password, (err, isSame) => {
        if (err) {
          return res.status(401).json({ msg: 'failed' })
        }
        if (isSame) {
          // sign a token for the verified user
          const token = jwt.sign(
            {
              number: user[0].number,
              userId: user[0]._id,
              name: user[0].name,
            },
            'jwtKey',
            {
              expiresIn: '4h',
            }
          )
          return res.status(200).json({
            msg: 'Success',
            token,
          })
        }
        return res.status(401).json({ msg: 'Password Incorrect' })
      })
    })
    .catch((err) => {
      res.status(500).json({ err })
    })
})

/**
 * remove a user by user number
 */
router.delete('/:userNumber', (req, res, next) => {
  User.remove({ number: req.params.userNumber })
    .exec()
    .then((result) => {
      res.status(400).json({ msg: 'Successfully deleted user.' })
    })
    .catch((err) => {
      res.status(500).json({ err })
    })
})

/**
 * get all user list
 */
router.get('/', (req, res, next) => {
  User.find()
    .select('_id number name')
    .exec()
    .then((result) => {
      res.status(200).json(result)
    })
    .catch((err) => {
      res.status(500).json({ err })
    })
})

module.exports = router
