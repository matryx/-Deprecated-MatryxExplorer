/*
MatryxExplorer API routing for all round based REST calls

author - sam@nanome.ai
Copyright Nanome Inc 2018
*/

const express = require('express')
const router = express.Router()

const ethPlatform = require('../controllers/eth/platformCalls')

// Return a message showing this endpoint series handles submission requests
router.get('/', (req, res, next) => {
  res.status(200).json({
        // TODO send back the list of tournaments
    message: 'handling GET requests to /submissions'
  })
})

// Return the tournament details for a specific tournament
router.get('/address/:submissionAddress', (req, res, next) => {
  const address = req.params.submissionAddress
  details = ethPlatform.getSubmissionByAddress(address).then(function (result) {
    res.status(200).json({
      submissionTitle: result._submissionTitle,
      submissionAddress: address,
      submissionAuthor: result._submissionAuthor,
      submissionId: result._submissionId,
      submissionDescription: result._submissionDescription,
      submissionCollaborators: result._submissionCollaborators,
      submissionReferences: result._submissionReferences,
      submissionJson: result._submissionJson,
      submissionIpfsHash: result._submissionIpfsHash,
      submissionRewardTotal: result._submissionRewardTotal,
      submissionSelectedRound: result._submissionSelectedRound,
      submissionDate: result._submissionDate,
      parentInfo: [
        {
          currentRound: result._parentInfo._currentRound,
          totalRounds: result._parentInfo._totalRounds,
          roundAddress: result._parentInfo._roundAddress,
          roundMtx: result._parentInfo._roundMtx,
          tournamentName: result._parentInfo._tournamentName,
          tournamentAddress: result._parentInfo._tournamentAddress
        }
      ]
    })
  })
})
//
// // Return the tournament details for a specific tournament
// router.get('/address/:submissionAddress', (req, res, next) => {
//   const address = req.params.submissionAddress
//   if (id == 'special') {
//     res.status(200).json({
//       message: 'Return the submission details',
//       address: address
//     })
//   }
// })
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
