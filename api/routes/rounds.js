/*
MatryxExplorer API routing for all round based REST calls

author - sam@nanome.ai
Copyright Nanome Inc 2018
*/

const express = require('express')
const router = express.Router()

const externalApiCalls = require('../controllers/gateway/externalApiCalls')
const roundController = require('../controllers/roundController')
// const matryxPlatformCalls = require('../controllers/gateway/matryxPlatformCalls')
const { errorHelper, validateAddress } = require('../helpers/responseHelpers')

const latestVersion = process.env.PLATFORM_VERSION

// Return a list of all rounds
router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'handling GET requests to /rounds'
  })
})

// TODO: add error response for invalid responses
router.get('/getAbi/:version?', (req, res, next) => {
  let version = req.params.version || latestVersion

  externalApiCalls
    .getMatryxRoundAbi(version)
    .then(({ abi }) => res.status(200).json({ abi }))
    .catch(errorHelper(res, 'Error getting ABI for ' + version))
})

// TODO: add error response for invalid responses
router.get('/address/:roundAddress', (req, res, next) => {
  let { roundAddress } = req.params
  if (!validateAddress(res, roundAddress)) return

  console.log('>RoundRouter: Retrieving Round Details for: ' + roundAddress)

  roundController
    .getRoundDetails(roundAddress)
    .then(data => res.status(200).json({ data }))
    .catch(errorHelper(res, 'Error getting round ' + roundAddress))
})

// TODO: is this needed?
// Does this even work? test
// TODO: add error response for invalid responses
// router.get('/address/:roundAddress/submission/:submissionIndex', (req, res, next) => {
//   let { roundAddress, submissionIndex } = req.params
//   if (!validateAddress(roundAddress)) return

//   matryxPlatformCalls
//     .getSubmissionAddressFromRound(roundAddress, submissionIndex)
//     .then(submissionAddress => {
//       res.status(200).json({
//         roundAddress,
//         submissionIndex,
//         submissionAddress
//       })
//     })
//     .catch(errorHelper(res, 'Error getting submission ' + submissionIndex + ' for ' + roundAddress))
// })

module.exports = router
