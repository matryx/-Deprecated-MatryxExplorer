require("dotenv").config()
require('isomorphic-fetch')
const http = require('http')
const https = require('https')
const fs = require('fs')
const app = require('./app')

const httpPort = process.env.HTTP_PORT || 3000
const httpsPort = process.env.HTTPS_PORT || 3443

const httpsOptions = {
  key: fs.readFileSync('./certs/local.key'),
  cert: fs.readFileSync('./certs/local.crt'),
  requestCert: false,
  rejectUnauthorized: false
}

const httpServer = http.createServer(app)
const httpsServer = https.createServer(httpsOptions, app)

console.log('стремиться к победе')

httpServer.listen(httpPort, () => {
  console.log(`HTTP server running at http://localhost:${httpPort}`)
})
httpsServer.listen(httpsPort, () => {
  console.log(`HTTPS server running at https://localhost:${httpsPort}`)
})

module.exports = httpServer
