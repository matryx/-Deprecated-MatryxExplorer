/*
MatryxExplorer API routing for all tournament based REST calls

author - sam@nanome.ai
Copyright Nanome Inc 2018
*/

const express = require('express')
const ethPlatform = require('../controllers/gateway/platformCalls')
const tournamentController = require('../controllers/tournamentController')

const router = express.Router()

// Return a confirmation the API is live
router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'handling requests to /tournaments'
  })
})

// Return a confirmation the API is live
router.get('/getAbi/:version', (req, res, next) => {
  let version = req.params.version
  try {
    let tAbi = require('../../data/abi/' + version + '/tournament')
    res.status(200).json({
      abi: tAbi
    })
  } catch (err) {
    console.log('Error yo')
    res.status(200).json({
      errorMessage: 'Sorry, that version does not exist.',
      error: err
    })
  }
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
  tournamentController.getTournamentByAddress(address).then(function (result) {
    res.status(200).json({
      tournamentDetails: result
    })
  }).catch((err) => {
    res.status(300).json({
      error: 'Unable to find tournament'
    })
  })
})

// Return the tournament owner for a specific tournament
router.get('/address/:tournamentAddress/getOwner', (req, res, next) => {
  const address = req.params.tournamentAddress
  tournamentController.getTournamentOwnerByAddress(address).then(function (result) {
    res.status(200).json({
      tournamentOwner: result,
      tournamentAddress: address
    })
  })
})

// // Return the tournament details for a specific tournament
// router.get('/id/:tournamentID', (req, res, next) => {
//   const id = req.params.tournamentID
//   ethPlatform.getTouramentById(id).then(function (result) {
//     res.status(200).json({
//       results: result
//     })
//   })
// })
//
// // Return the tournament owner for a specific tournament
// router.get('/id/:tournamentID/getOwner', (req, res, next) => {
//   const id = req.params.tournamentID
//   details = ethPlatform.getTournamentOwnerById(id).then(function (result) {
//     res.status(200).json({
//       tournamentOwner: result.tournamentOwner,
//       tournamentId: id,
//       tournamentAddress: result.tournamentAddress
//     })
//   })
// })

// Return the submission count for a specific tournament
router.get('/address/:tournamentAddress/submissionCount', (req, res, next) => {
  const address = req.params.tournamentAddress
  tournamentController.getSubmissionCount(address).then(function (result) {
    res.status(200).json({
      results: result
    })
  }).catch((err) => {
    console.log('Not able to retrieve submissionCount: ' + err)
  })
})

// TODO: Waiting on Max, need to implement the Round is open in order to access this
// Current Round response given a tournamentAddress
router.get('/address/:tournamentAddress/currentRound', (req, res, next) => {
  const address = req.params.tournamentAddress
  ethPlatform.getCurrentRoundFromTournamentAddress(address).then(function (result) {
    res.status(200).json({
      message: 'Awaiting StateControl for QA'
      // title: result._title,
      // bounty: result._bounty,
      // description: result._description,
      // currentRound: result._currentRound,
      // roundAddress: result._roundAddress,
      // submissions: result._submissions
    })
  }).catch((err) => {
    console.log('Not able to retrieve latest round: ' + err)
  })
})

/*
#################################
These are all TEST or HELPER functions
#################################
*/

// router.post('/', (req, res, next) => {
//     res.status(200).json({
//         message: 'handling POST requests to /products'
//     });
// });

module.exports = router

// TODO Swagger integration
