const app = require('express')()
const bodyParser = require('body-parser')
const config = require('./config')

const version = config.CURRENT_VERSION

// Middlewares
app.use(require('helmet')()) // security headers
app.use(require('compression')()) // compression
app.use(require('morgan')('dev')) // logging
app.use(require('cors')()) // CORS
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Routes
app.get('/', (req, res) => {
  res.send('Somewhere, something incredible is waiting to be known. <br> - Carl Sagan')
})
app.get('/health-check', (req, res) => res.sendStatus(200))

app.use('/v2', require('./v2/router'))
app.use('/v3', require('./v3/router'))
app.use('/', require(`./${version}/router`))

// 404 error handling
app.use((req, res, next) => {
  next({ status: 404, response: 'Not Found' })
})

// error handling
app.use((error, req, res, next) => {
  const dev = process.env.NODE_ENV !== 'production'

  console.error(`ERR ${req.originalUrl} - ${error.message || error.response}`)
  // istanbul ignore next
  if (error.stack) console.error(`    ${error.stack}`)

  // istanbul ignore next
  res.status(error.status || 500)

  // istanbul ignore next
  res.json({
    error: {
      message: error.response || 'Something went wrong!',
      error: dev ? error : undefined
    }
  })
})

module.exports = app
