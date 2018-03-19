/*
MatryxExplorer API routing for all tournament based REST calls

author - sam@nanome.ai
Copyright Nanome Inc 2018
*/

const express = require('express')
const ethPlatform = require('../controllers/eth/platformCalls')
const tournamentController = require('../controllers/tournamentController')
const router = express.Router()

// Return a confirmation the API is live
router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'handling requests to /tournaments'
  })
})

// Return number of tournaments
router.get('/count', (req, res, next) => {
  tournamentController.count().then(function (result) {
    res.status(200).json({
      tournamentCount: result
    })
  })
})

// Return all of the tournaments
// TODO fix
router.get('/allTournaments', (req, res, next) => {
    // TODO replace function with working model+final name
  tournamentController.getAllTournaments().then(function (tournaments) {
    res.status(200).json({
      tournaments
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

// Return the tournament owner for a specific tournament
router.get('/address/:tournamentAddress/getOwner', (req, res, next) => {
  const address = req.params.tournamentAddress
  details = ethPlatform.getTournamentOwnerByAddress(address).then(function (result) {
    res.status(200).json({
      tournamentOwner: result.tournamentOwner,
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

// Return the tournament owner for a specific tournament
router.get('/id/:tournamentID/getOwner', (req, res, next) => {
  const id = req.params.tournamentID
  details = ethPlatform.getTournamentOwnerById(id).then(function (result) {
    res.status(200).json({
      tournamentOwner: result.tournamentOwner,
      tournamentId: id,
      tournamentAddress: result.tournamentAddress
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

// Current Round response given a tournamentAddress
router.get('/address/:tournamentAddress/currentRound', (req, res, next) => {
  const address = req.params.tournamentAddress
  ethPlatform.getCurrentRoundFromTournamentAddress(address).then(function (result) {
    res.status(200).json({
      title: result._title,
      bounty: result._bounty,
      description: result._description,
      currentRound: result._currentRound,
      roundAddress: result._roundAddress,
      submissions: result._submissions
    })
  })
})

/*
#################################
These are all TEST functions
#################################
*/
// notsure
router.get('/allTournaments2', (req, res, next) => {
  ethPlatform.getAllTournaments2().then(function (result) {
    res.status(200).json({
      tournamentCount: result
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
