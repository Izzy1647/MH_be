const express = require('express')
const mongoose = require('mongoose')
const Order = require('../models/order')
const Product = require('../models/product')
const checkAuth = require('../middleware/check-auth')
const router = express.Router()

/**
 * get all orders
 */
router.get('/', (req, res, next) => {
  Order.find()
    .select('-__v')
    .populate('product', '-__v')
    .exec()
    .then((result) => {
      res.status(200).json(result)
    })
    .catch((err) => res.status(500).json({ err }))
})

/**
 * place an order
 */
router.post('/', checkAuth, (req, res, next) => {
  Product.findById(req.body.productId)
    // fist check whether the productId exists
    .then((product) => {
      if (!product) {
        return res.status(404).json({
          err: 'Product not found',
        })
      }
      console.log("req.userData:", req.userData)
      const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId,
      })
      return order.save()
    })
    // if productId exists, save the order
    .then((result) => {
      const response = {
        msg: 'Order successfully stored',
        data: {
          productId: result.product,
          orderId: result._id,
          quantity: result.quantity,
        },
      }
      res.status(201).json(response)
    })
    .catch((err) => res.status(500).json({ err }))
})

module.exports = router
