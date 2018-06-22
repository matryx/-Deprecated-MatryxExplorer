/*
MatryxExplorer API routing for all round based REST calls

author - sam@nanome.ai
Copyright Nanome Inc 2018
*/

const express = require('express')
const bodyParser = require('body-parser')
const formidable = require('formidable')
const tmp = require('tmp')
const fs = require('fs')
const util = require('util')

const externalApiCalls = require('../controllers/gateway/externalApiCalls')
const submissionController = require('../controllers/submissionController')
const ipfsCalls = require('../controllers/gateway/ipfsCalls')
const fileHandler = require('../controllers/gateway/fileHandler')
const ethHelper = require('../helpers/ethHelper')

const router = express.Router()

let jsonParser = bodyParser.json({ extended: true })
let bodyParserUrlEncoded = bodyParser.urlencoded({ extended: true })
// let latestVersion = process.env.LATEST_VERSION
let latestVersion = process.env.PLATFORM_VERSION

// Return a message showing this endpoint series handles submission requests
router.get('/', (req, res, next) => {
  res.status(200).json({
        // TODO send back the list of tournaments
    message: 'handling GET requests to /submissions'
  })
})

router.get('/getLatestAbi', (req, res, next) => {
  let version = req.params.version
  try {
    externalApiCalls.getMatryxSubmissionAbi(latestVersion).then(function (resultingAbi) {
      // console.log(resultingAbi)
      res.status(200).json({
        abi: resultingAbi.abi
      })
    })
  } catch (err) {
    console.log('Error loading the ABI')
    res.status(500).json({
      errorMessage: 'Sorry, that version does not exist.',
      errorMsg: err.message
    })
  }
})

router.get('/getAbi/:version', (req, res, next) => {
  let version = req.params.version
  try {
    externalApiCalls.getMatryxSubmissionAbi(version).then(function (resultingAbi) {
      // console.log(resultingAbi)
      res.status(200).json({
        abi: resultingAbi.abi
      })
    })// implement catch logic later for v1
  } catch (err) {
    console.log('Error loading the ABI')
    res.status(500).json({
      errorMessage: 'Sorry, that version does not exist.',
      errorMsg: err.message
    })
  }
})

// Return the submission details for a specific submission address
router.get('/address/:submissionAddress', (req, res, next) => {
  const address = req.params.submissionAddress
  if (!ethHelper.isAddress(address)) {
    res.status(500).json({
      errorMsg: 'This is not a valid ethereum address'
    })
  } else {
    details = submissionController.getSubmissionByAddress(address).then(function (result) {
      res.status(200).json({
        submissionDetails: result
      })
    }).catch((err) => {
      res.status(500).json({
        errorMsg: err.message
      })
    })
  }
})

// Return the submission owner/author for a specific submission address
router.get('/address/:submissionAddress/getOwner', (req, res, next) => {
  const address = req.params.submissionAddress
  if (!ethHelper.isAddress(address)) {
    res.status(500).json({
      errorMsg: 'This is not a valid ethereum address'
    })
  } else {
    submissionController.getSubmissionOwnerByAddress(address).then(function (result) {
      res.status(200).json({
        submissionOwner: result
      })
    }).catch(function (err) {
      res.status(500).json({
        errorMsg: err.message
      })
    })
  }
})

// Return the submission owner/author for a specific submission address
router.get('/address/:submissionAddress/isCreator/:userAddress', (req, res, next) => {
  const submissionAddress = req.params.submissionAddress
  const userAddress = req.params.userAddress
  if (!ethHelper.isAddress(submissionAddress) && !ethHelper.isAddress(userAddress)) {
    res.status(500).json({
      errorMsg: 'This is not a valid ethereum address'
    })
  } else {
    submissionController.isCreator(submissionAddress, userAddress).then(function (isCreatorBool) {
      res.status(200).json({
        result: isCreatorBool
      })
    }).catch(function (err) {
      res.status(500).json({
        errorMsg: err.message
      })
    })
  }
})

/*
These are are experiemental or old
*/

// // Return the submission details for a specific submission address
// router.get('/address/:submissionAddress', (req, res, next) => {
//   const address = req.params.submissionAddress
//   details = submissionController.getSubmissionByAddress(address).then(function (result) {
//     res.status(200).json({
//       submissionTitle: result._submissionTitle,
//       submissionAddress: address,
//       submissionAuthor: result._submissionAuthor,
//       submissionId: result._submissionId,
//       submissionDescription: result._submissionDescription,
//       submissionCollaborators: result._submissionCollaborators,
//       submissionReferences: result._submissionReferences,
//       submissionJson: result._submissionJson,
//       submissionIpfsHash: result._submissionIpfsHash,
//       submissionRewardTotal: result._submissionRewardTotal,
//       submissionSelectedRound: result._submissionSelectedRound,
//       submissionDate: result._submissionDate,
//       parentInfo: [
//         {
//           currentRound: result._parentInfo._currentRound,
//           totalRounds: result._parentInfo._totalRounds,
//           roundAddress: result._parentInfo._roundAddress,
//           roundMtx: result._parentInfo._roundMtx,
//           tournamentName: result._parentInfo._tournamentName,
//           tournamentAddress: result._parentInfo._tournamentAddress
//         }
//       ]
//     })
//   })
// })

module.exports = router
