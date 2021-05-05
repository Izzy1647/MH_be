const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')

const app = express()

const productRoutes = require('./api/routes/product')
const ordersRoutes = require('./api/routes/order')
const reservationRoutes = require('./api/routes/reservation')
const userRoutes = require('./api/routes/user')
const boardRoutes = require('./api/routes/board')
const articleRoutes = require('./api/routes/article')


// connect the database
mongoose.connect(
  `mongodb+srv://zhouzhiyu:zhouzhiyu@node-mental-health.99fad.mongodb.net/mentalHealthDatabase?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
)

// for request logs
app.use(morgan('dev'))

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// handle CORS issue
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', '*')

  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE')
    return res.status(200).json({})
  }
  next()
})

// routes to handle requests
app.use('/product', productRoutes)
app.use('/order', ordersRoutes)
app.use('/user', userRoutes)
app.use('/reservation', reservationRoutes)
app.use('/board', boardRoutes)
app.use('/article', articleRoutes)


// capture requests that skip through routes above (error handling)
app.use((req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.json({
    error: {
      msg: `error: ${err.message}`,
    },
  })
})

module.exports = app
