const express = require('express')
const mongoose = require('mongoose')

const router = express.Router()

const Product = require('../models/product')

/**
 * get all products
 */
router.get('/', (req, res, next) => {
  Product.find()
    .select('-__v') // remove the __v field
    .exec()
    .then((data) => {
      const response = {
        count: data.length,
        products: data.map((item) => {
          return {
            name: item.name,
            price: item.price,
            _id: item._id,
            detail: {
              type: 'GET',
              url: `${req.protocol}://${req.get('host')}/product/${item._id}`,
            },
          }
        }),
      }
      res.status(200).json(response)
    })
    .catch((err) => {
      res.status(500).json({
        err,
      })
    })
})

/**
 * add a new product
 */
router.post('/', (req, res, next) => {
  // create a new product and save it in mongodb
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
  })

  product
    .save()
    .then((result) =>
      res.status(200).json({
        msg: 'Successfully created new product',
        product: {
          name: result.name,
          price: result.price,
          _id: result._id,
          detail: {
            type: 'GET',
            url: `${req.protocol}://${req.get('host')}/product/${result._id}`,
          },
        },
      })
    )
    .catch((err) =>
      res.status(500).json({
        err,
      })
    )
})

/**
 * get detail info of a product by productId
 */
router.get('/:productId', (req, res, next) => {
  const id = req.params.productId
  Product.findById(id)
    .select('-__v')
    .exec()
    .then((result) => {
      if (result) {
        res.status(200).json(result)
      } else {
        res.status(404).json({
          err: 'id invalid',
        })
      }
    })
    .catch((err) => res.status(500).json({ err }))
})

/**
 * delete a product by id
 */
router.delete('/:productId', (req, res, next) => {
  const _id = req.params.productId
  Product.remove({ _id })
    .exec()
    .then((result) => {
      res.status(200).json({
        msg: 'Successfully deleted',
        _id,
      })
    })
    .catch((err) => res.status(500).json({ err }))
})

/**
 * edit an existing product
 */
router.put('/:productId', (req, res, next) => {
  const id = req.params.productId

  Product.findByIdAndUpdate(id, { $set: req.body }, { new: true })
    .then((result) => res.status(200).json(result))
    .catch((err) => res.status(500).json({ error: err }))
})

module.exports = router
