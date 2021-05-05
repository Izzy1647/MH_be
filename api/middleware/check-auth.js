const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1] // remove the 'Bearer ' part
    const decoded = jwt.verify(token, 'jwtKey')
    req.userData = decoded // add userData property for further distract
    // next()
  } catch (err) {
    console.log("Auth err:", err)
    return res.status(404).json({
      msg: 'Auth failed',
    })
  }
  next()
}
