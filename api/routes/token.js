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

router.get('/getLatestInfo', (req, res, next) => {
  externalApiCalls
    .getMatryxTokenInfo(latestVersion)
    .then(result => {
      let { address } = result['networks'][networkId]
      let { abi } = result
      res.status(200).json({ address, abi })
    })
    .catch(errorHelper(res, 'Error getting latest info'))
})

router.get('/getAddress', (req, res, next) => {
  externalApiCalls
    .getMatryxTokenInfo(latestVersion)
    .then(result => {
      let { address } = result['networks'][networkId]
      res.status(200).json({ address })
    })
    .catch(errorHelper(res, 'Error getting latest address'))
})

router.get('/getAbi', (req, res, next) => {
  externalApiCalls
    .getMatryxTokenInfo(latestVersion)
    .then(result => {
      let { abi } = result
      res.status(200).json({ abi })
    })
    .catch(errorHelper(res, 'Error getting latest ABI'))
})

module.exports = router
