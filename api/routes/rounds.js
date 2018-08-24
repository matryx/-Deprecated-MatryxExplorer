/*
MatryxExplorer API routing for all round based REST calls

author - sam@nanome.ai
Copyright Nanome Inc 2018
*/

const express = require('express')
const router = express.Router()

const externalApiCalls = require('../controllers/gateway/externalApiCalls')
const roundController = require('../controllers/roundController')
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
  // istanbul ignore next
  let version = req.params.version || latestVersion

  externalApiCalls
    .getMatryxRoundAbi(version)
    .then(({ abi }) => res.status(200).json({ abi }))
    .catch(errorHelper(next, `Error getting Round ABI for ${version}`))
})

// TODO: add error response for invalid responses
router.get('/address/:roundAddress', (req, res, next) => {
  let { roundAddress } = req.params
  if (!validateAddress(next, roundAddress)) return

  roundController
    .getRoundDetails(roundAddress)
    .then(round => res.status(200).json({ round }))
    .catch(errorHelper(next, `Error getting Round ${roundAddress}`))
})

module.exports = router
