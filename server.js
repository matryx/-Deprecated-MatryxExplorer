require('isomorphic-fetch')
const http = require('http')
const app = require('./app')

const port = process.env.PORT || 3000
const server = http.createServer(app)

console.log('стремиться к победе')

server.listen(port)

module.exports = server
