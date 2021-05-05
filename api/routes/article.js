const express = require('express')
const mongoose = require('mongoose')
const Article = require('../models/article')
// const checkAuth = require('../middleware/check-auth')
const router = express.Router()

/**
 * get all article titles
 */
router.get('/', (req, res, next) => {
  Article.find()
    .select('title')
    .exec()
    .then((result) => {
      res.status(200).json({ result })
    })
    .catch((err) => res.status(500).json({ err }))
})

/**
 * get article content by article Id
 */
router.get('/:articleId', (req, res, next) => {
  Article.find({
    _id: req.params.articleId,
  })
    .select('-__v')
    .then((result) => {
      res.status(200).json({ result })
    })
    .catch((err) => res.status(500).json({ err }))
})

/**
 * upload an article
 */
router.post('/', (req, res, next) => {
  const article = new Article({
    _id: new mongoose.Types.ObjectId(),
    title: req.body.title,
    author: req.body.author,
    content: req.body.content,
  })
  article
    .save()
    .then((result) =>
      res.status(200).json({ msg: 'Successfully uplaoded article', result })
    )
    .catch((err) => res.status(500).json({ err }))
})

/**
 * delete an article by articleId
 */
router.delete('/:articleId', (req, res, next) => {
  Article.remove({ _id: req.params.articleId })
    .exec()
    .then((result) => {
      res.status(400).json({ msg: 'Successfully deleted article.' })
    })
    .catch((err) => {
      console.log('delete reservation error:', err)
      res.status(500).json({ msg: 'error' })
    })
})

module.exports = router
