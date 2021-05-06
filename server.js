const https = require('https')
const app = require('./app')

const port = process.env.PORT || 3001

const server = https.createServer(app)

server.listen(port)
