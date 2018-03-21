/*
MatryxExplorer API routing for all round based REST calls

author - sam@nanome.ai
Copyright Nanome Inc 2018
*/

const express = require('express')
const router = express.Router()

const externalApiCalls = require('../controllers/gateway/externalApiCalls')
const ethPlatform = require('../controllers/gateway/platformCalls')
const submissionController = require('../controllers/submissionController')
// Return a message showing this endpoint series handles submission requests
router.get('/', (req, res, next) => {
  res.status(200).json({
        // TODO send back the list of tournaments
    message: 'handling GET requests to /submissions'
  })
})

// Return the submission details for a specific submission address
router.get('/address/:submissionAddress', (req, res, next) => {
  const address = req.params.submissionAddress
  details = submissionController.getSubmissionByAddress(address).then(function (result) {
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

// Return the submission owner/author for a specific submission address
router.get('/address/:submissionAddress/getOwner', (req, res, next) => {
  const address = req.params.submissionAddress
  submissionController.getSubmissionOwnerByAddress(address).then(function (result) {
    res.status(200).json({
      submissionOwner: result
    })
  })
})

// Return the submission owner/author for a specific submission address
router.get('/address/:submissionAddress/getIpfsData/:ipfsHash', (req, res, next) => {
  const address = req.params.submissionAddress
  const ipfsHash = req.params.ipfsHash
  console.log('Retrieving submission data from IPFS using externalAddress: ' + ipfsHash)
  // submissionController.getSubmissionOwnerByAddress(address).then(function (result) {
  externalApiCalls.davidIPFS(ipfsHash).then(function (result) {
    res.status(200).json({
      hashResult: result
    })
  })
})

module.exports = router
