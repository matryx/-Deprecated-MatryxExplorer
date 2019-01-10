const app = require('express')()
const bodyParser = require('body-parser')

const version = process.env.CURRENT_VERSION || "v3"

// Middlewares
app.use(require('helmet')()) // security headers
app.use(require('compression')()) // compression
app.use(require('morgan')('dev')) // logging
app.use(require('cors')()) // CORS
app.use(require('cookie-parser')(process.env.SECRET || 'Yum!')) // 🍪
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(bodyParser.text())
app.use((req, res, next) => {
  req.args = {}
  Array('params', 'query', 'body').forEach(reqKey => {
    if (typeof req[reqKey] === 'object') {
      Object.assign(req.args, req[reqKey])
    }
  });
  next()
})

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

  if (error.isJoi) {
    delete error.isJoi
    return res.status(403).json({
      success: false,
      error: error
    })
  }

  // istanbul ignore next
  res.status(error.status || 500).json({
    error: {
      message: error.response || 'Something went wrong!',
      error: dev ? error : undefined
    }
  })
})

module.exports = app
