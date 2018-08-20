const express = require('express')
const compression = require('compression')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()

const platformRoutes = require('./api/routes/platform')
const tournamentRoutes = require('./api/routes/tournaments')
const roundRoutes = require('./api/routes/rounds')
const submissionRoutes = require('./api/routes/submissions')
// const activityRoutes = require('./api/routes/activity')
const tokenRoutes = require('./api/routes/token')
const ipfsRoutes = require('./api/routes/ipfs')

// Enable GZIP compression
app.use(compression())
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

app.use('/platform', platformRoutes)
app.use('/tournaments', tournamentRoutes)
app.use('/rounds', roundRoutes)
app.use('/submissions', submissionRoutes)
// app.use('/activity', activityRoutes)
app.use('/token', tokenRoutes)
app.use('/ipfs', ipfsRoutes)

console.log('стремиться к победе')

app.get('/', (req, res) => {
  res.send('Somewhere, something incredible is waiting to be known. <br> - Carl Sagan')
})

// Error handling
app.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})

app.use((error, req, res, next) => {
  res.status(error.status || 500)
  res.json({
    error: {
      message: error.message
    }
  })
})

module.exports = app
