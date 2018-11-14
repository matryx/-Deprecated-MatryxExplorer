require('dotenv').config()

const app = require('express')()
const bodyParser = require('body-parser')

const v2abis = require('./v2/helpers/getAbis')
const version = process.env.CURRENT_VERSION

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

// Current routes
app.use('/users', require(`./${version}/routes/users`))
app.use('/platform', require(`./${version}/routes/platform`))
app.use('/tournaments', require(`./${version}/routes/tournaments`))
app.use('/rounds', require(`./${version}/routes/rounds`))
app.use('/submissions', require(`./${version}/routes/submissions`))
// app.use('/activity', require(`./${version}/routes/activity`))
app.use('/token', require(`./${version}/routes/token`))
app.use('/ipfs', require(`./${version}/routes/ipfs`))


// make sure ABIs loaded before requests to v2
app.use('/v2/', async (req, res, next) => {
  await v2abis.loadedAbis
  next()
})

// Ropsten
app.get('/v2', (req, res) => res.sendStatus(200))
app.use('/v2/platform', require('./v2/routes/platform'))
app.use('/v2/tournaments', require('./v2/routes/tournaments'))
app.use('/v2/rounds', require('./v2/routes/rounds'))
app.use('/v2/submissions', require('./v2/routes/submissions'))
// app.use('/v2/activity', require('./v2/routes/activity'))
app.use('/v2/token', require('./v2/routes/token'))
app.use('/v2/ipfs', require('./v2/routes/ipfs'))

app.get('/v2/update', async (req, res, next) => {
  try {
    const updated = await v2abis.attemptUpdate()
    const message = updated ? 'ABIs updated' : 'ABIs already up to date'
    res.status(200).json({ message })
  } catch (err) {
    next({ response: 'ABIs update failed' })
  }
})

// epic-refactor
app.get('/v3', (req, res) => res.sendStatus(200))
app.use('/v3/users', require('./v3/routes/users'))
app.use('/v3/platform', require('./v3/routes/platform'))
app.use('/v3/tournaments', require('./v3/routes/tournaments'))
app.use('/v3/rounds', require('./v3/routes/rounds'))
app.use('/v3/submissions', require('./v3/routes/submissions'))
// app.use('/v3/activity', require('./v3/routes/activity'))
app.use('/v3/token', require('./v3/routes/token'))
app.use('/v3/ipfs', require('./v3/routes/ipfs'))

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
