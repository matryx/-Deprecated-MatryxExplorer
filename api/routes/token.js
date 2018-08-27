/*
MatryxExplorer API routing for all tournament based REST calls

author - sam@nanome.ai
Copyright Nanome Inc 2018
*/

const express = require('express')
const router = express.Router()

const externalApiCalls = require('../controllers/gateway/externalApiCalls')
const { errorHelper } = require('../helpers/responseHelpers')

const latestVersion = process.env.PLATFORM_VERSION
const networkId = process.env.NETWORK_ID

// Return a confirmation the API is live
router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'handling requests to /MatryxToken'
  })
})

router.get('/getInfo/:version?', (req, res, next) => {
  // istanbul ignore next
  let version = req.params.version || latestVersion

  externalApiCalls
    .getMatryxTokenInfo(version)
    .then(result => {
      let { address } = result['networks'][networkId]
      let { abi } = result
      res.status(200).json({ address, abi })
    })
    .catch(errorHelper(next, 'Error getting Token info'))
})

router.get('/getAddress/:version?', (req, res, next) => {
  // istanbul ignore next
  let version = req.params.version || latestVersion

  externalApiCalls
    .getMatryxTokenInfo(version)
    .then(result => {
      let { address } = result['networks'][networkId]
      res.status(200).json({ address })
    })
    .catch(errorHelper(next, 'Error getting Token address'))
})

router.get('/getAbi/:version?', (req, res, next) => {
  // istanbul ignore next
  let version = req.params.version || latestVersion

  externalApiCalls
    .getMatryxTokenInfo(version)
    .then(result => {
      let { abi } = result
      res.status(200).json({ abi })
    })
    .catch(errorHelper(next, 'Error getting Token ABI'))
})

module.exports = router
