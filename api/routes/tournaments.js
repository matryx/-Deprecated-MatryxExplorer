/*
MatryxExplorer API routing for all tournament based REST calls

author - sam@nanome.ai
Copyright Nanome Inc 2018
*/

const express = require('express')
const ethPlatform = require('../controllers/eth/platformCalls')

const router = express.Router()

// Return a list of all tournaments
router.get('/', (req, res, next) => {
  res.status(200).json({
        // TODO send back the list of tournaments
        // tournaments = ethPlatform.getAllTournaments();
    message: 'handling requests to /tournaments'
  })
})

// Return number of tournaments
router.get('/count', (req, res, next) => {
  ethPlatform.getTournamentCount().then(function (result) {
    res.status(200).json({
      tournamentCount: result
    })
  })
})

// Return number of tournaments
router.get('/allTournaments', (req, res, next) => {
  ethPlatform.getTournamentCount().then(function (result) {
    res.status(200).json({
      tournamentCount: result
    })
  })
})

// Return the tournament details for a specific tournament
// TODO pass back the tournament details
router.get('/address/:tournamentAddress', (req, res, next) => {
  const address = req.params.tournamentAddress
  details = ethPlatform.getTournamentByAddress(address).then(function (result) {
    res.status(200).json({
      tournamentDetails: result,
      tournamentAddress: address
    })
  })
})

// Return the tournament details for a specific tournament
router.get('/id/:tournamentID', (req, res, next) => {
  const id = req.params.tournamentID
  ethPlatform.getTouramentById(id).then(function (result) {
    res.status(200).json({
      results: result
    })
  })
})

/*
These are all testing functions
*/

router.get('/allTournaments2', (req, res, next) => {
  ethPlatform.getAllTournaments2().then(function (result) {
    res.status(200).json({
      tournamentCount: result
    })
  })
})

// Return the tournament details for a specific tournament
router.get('/address/:tournamentAddress/submissionCount', (req, res, next) => {
  const address = req.params.tournamentAddress
  ethPlatform.getSubmissionCount(address).then(function (result) {
    res.status(200).json({
      results: result
    })
  })
})

// router.post('/', (req, res, next) => {
//     res.status(200).json({
//         message: 'handling POST requests to /products'
//     });
// });

module.exports = router

// TODO Swagger integration
