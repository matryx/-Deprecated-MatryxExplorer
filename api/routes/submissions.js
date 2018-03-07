/*
MatryxExplorer API routing for all round based REST calls

author - sam@nanome.ai
Copyright Nanome Inc 2018
*/

const express = require('express')
const router = express.Router()

const ethPlatform = require('../controllers/eth/platformCalls')

// Return a list of all rounds
router.get('/', (req, res, next) => {
  res.status(200).json({
        // TODO send back the list of tournaments
    message: 'handling GET requests to /submissions'
  })
})

// Return the tournament details for a specific tournament
router.get('/id/:submissionID', (req, res, next) => {
  const id = req.params.submissionID
  res.status(200).json({
    message: 'You discovered the specialID',
    id: id
  })
})

// Return the tournament details for a specific tournament
router.get('/address/:submissionAddress', (req, res, next) => {
  const address = req.params.submissionAddress
  if (id == 'special') {
    res.status(200).json({
      message: 'Return the submission details',
      address: address
    })
  }
})
//
// router.post('/getSubmission', (req, res, next) => {
//   var tournamentID = req.body.tournamentId
//   var roundID = req.body.roundId
//   res.status(201).json({
//     message: 'getSubmission request recieved.',
//     submissionObject: 'bam'
//   })
// })

// router.post('/', (req, res, next) => {
//     res.status(200).json({
//         message: 'handling POST requests to /products'
//     });
// });

module.exports = router
