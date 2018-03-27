const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()

// process.env.DB_HOST
const externalApiCalls = require('./api/controllers/gateway/externalApiCalls')
const ipfsCalls = require('./api/controllers/gateway/ipfsCalls')
// Routes
const platformRoutes = require('./api/routes/platform')
const tournamentRoutes = require('./api/routes/tournaments')
const roundRoutes = require('./api/routes/rounds')
const submissionRoutes = require('./api/routes/submissions')
const activityRoutes = require('./api/routes/activity')
const tokenRoutes = require('./api/routes/token')

// tempAPI routes active
const tempPlatformRoutes = require('./tempApi/platform')
const tempTournamentRoutes = require('./tempApi/tournaments')
const tempRoundRoutes = require('./tempApi/rounds')
const tempActivityRoutes = require('./tempApi/activity')
const tempSubmissionRoutes = require('./tempApi/submissions')

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

app.use('/platform', platformRoutes)
app.use('/tournaments', tournamentRoutes)
app.use('/rounds', roundRoutes)
app.use('/submissions', submissionRoutes)
app.use('/activity', activityRoutes)
app.use('/token', tokenRoutes)

// tempAPI routes active
app.use('/tempAPI/platform', tempPlatformRoutes)
app.use('/tempAPI/tournaments', tempTournamentRoutes)
app.use('/tempAPI/rounds', tempRoundRoutes)
app.use('/tempAPI/activity', tempActivityRoutes)
app.use('/tempAPI/submissions', tempSubmissionRoutes)
// TODO add more temp APIs

// TODO add more error handling and timeout setting

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
