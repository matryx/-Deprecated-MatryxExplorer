require('dotenv').config()

const app = require('express')()
const bodyParser = require('body-parser')

const abis = require('./api/helpers/getAbis')

// make sure ABIs loaded before requests
app.use(async (req, res, next) => {
  await abis.loadedAbis
  next()
})

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

// Backwards compatibility
app.use('/platform', require('./api/routes/platform'))
app.use('/tournaments', require('./api/routes/tournaments'))
app.use('/rounds', require('./api/routes/rounds'))
app.use('/submissions', require('./api/routes/submissions'))
// app.use('/activity', require('./api/routes/activity'))
app.use('/token', require('./api/routes/token'))
app.use('/ipfs', require('./api/routes/ipfs'))

app.get('/update', async (req, res, next) => {
  try {
    const updated = await abis.attemptUpdate()
    const message = updated ? 'ABIs updated' : 'ABIs already up to date'
    res.status(200).json({ message })
  } catch (err) {
    next({ response: 'ABIs update failed' })
  }
})

app.get('/v1', (req, res) => res.sendStatus(200))
app.use('/v1/platform', require('./v1/routes/platform'))
app.use('/v1/tournaments', require('./v1/routes/tournaments'))
app.use('/v1/rounds', require('./v1/routes/rounds'))
app.use('/v1/submissions', require('./v1/routes/submissions'))
// app.use('/v1/activity', require('./v1/routes/activity'))
app.use('/v1/token', require('./v1/routes/token'))
app.use('/v1/ipfs', require('./v1/routes/ipfs'))

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
