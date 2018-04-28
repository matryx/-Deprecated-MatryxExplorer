/*
MatryxExplorer API routing for all round based REST calls

author - sam@nanome.ai
Copyright Nanome Inc 2018
*/

const express = require('express')
const router = express.Router()

const externalApiCalls = require('../controllers/gateway/externalApiCalls')
const roundController = require('../controllers/roundController')
const matryxPlatformCalls = require('../controllers/gateway/matryxPlatformCalls')
const ethHelper = require('../helpers/ethHelper')

let latestVersion = process.env.PLATFORM_VERSION

// Return a list of all rounds
router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'handling GET requests to /rounds'
  })
})

// TODO: add error response for invalid responses
router.get('/getLatestAbi', (req, res, next) => {
  let version = req.params.version
  try {
    externalApiCalls.getMatryxRoundAbi(latestVersion).then(function (resultingAbi) {
      console.log(resultingAbi)
      res.status(200).json({
        abi: resultingAbi.abi
      })
    }) // implement catch logic later for v1
  } catch (err) {
    console.log('Error loading the ABI')
    res.status(500).json({
      errorMessage: 'Sorry, that version does not exist.',
      error: err.message
    })
  }
})

// TODO: add error response for invalid responses
router.get('/getAbi/:version', (req, res, next) => {
  let version = req.params.version
  try {
    externalApiCalls.getMatryxRoundAbi(version).then(function (resultingAbi) {
      console.log(resultingAbi)
      res.status(200).json({
        abi: resultingAbi.abi
      })
    })
  } catch (err) {
    console.log('Error loading the ABI')
    res.status(500).json({
      errorMessage: 'Sorry, that version does not exist.',
      error: err.message
    })
  }
})

// TODO: add error response for invalid responses
router.get('/address/:address', (req, res, next) => {
  let roundAddress = req.params.address
  if (!ethHelper.isAddress(roundAddress)) {
    res.status(500).json({
      errorMsg: 'This is not a valid ethereum address'
    })
  } else {
    console.log('>RoundRouter: Retrieving Round Details for: ' + roundAddress)
    try {
      roundController.getRoundDetails(roundAddress).then(function (roundDetails) {
        res.status(200).json({
          data: roundDetails
        })
      })
    } catch (err) {
      res.status(500).json({
        errMsg: err.message
      })
    }
  }
})

// Does this even work? test
// TODO: add error response for invalid responses
router.get('/address/:address/submission/:submissionIndex', (req, res, next) => {
  let _roundAddress = req.params.address
  let _submissionIndex = req.params.submissionIndex
  if (!ethHelper.isAddress(_roundAddress)) {
    res.status(500).json({
      errorMsg: 'This is not a valid ethereum address'
    })
  } else {
    matryxPlatformCalls.getSubmissionAddressFromRound(_roundAddress, _submissionIndex, (err, _submissionAddress) => {
      if (err) {
        res.status(500).json({
          errorName: err.message
        })
      } else {
        res.status(200).json({
          roundAddress: _roundAddress,
          submissionIndex: _submissionIndex,
          submissionAddress: _submissionAddress
        })
      }
    })
  }
})

module.exports = router
