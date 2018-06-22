/*
MatryxExplorer API routing for all platform based REST calls

author - sam@nanome.ai
Copyright Nanome Inc 2018
*/

// TODO versioning api calls for the abi and latest platform info

const express = require('express')
const router = express.Router()

const externalApiCalls = require('../controllers/gateway/externalApiCalls')
const matryxPlatformCalls = require('../controllers/gateway/matryxPlatformCalls')
const { errorHelper } = require('../helpers/responseHelpers')

let latestVersion = process.env.PLATFORM_VERSION

// Return a message that this route handles all platform specific requests
router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'handling GET requests to /platform'
  })
})

// TODO fix this one...showing up as undefined due to scope
// Return a message that this route handles all platform specific requests
router.get('/getLatestInfo', (req, res, next) => {
  externalApiCalls
    .getMatryxPlatformInfo(latestVersion)
    .then(result => {
      let { address } = result['networks']['777']
      let { abi } = result
      res.status(200).json({ address, abi })
    })
    .catch(errorHelper(res, 'Error getting latest info'))
})

router.get('/getLatestAddress', (req, res, next) => {
  externalApiCalls
    .getMatryxPlatformInfo(latestVersion)
    .then(result => {
      let { address } = result['networks']['777']
      res.status(200).json({ address })
    })
    .catch(errorHelper(res, 'Error getting latest address'))
})

router.get('/getLatestAbi', (req, res, next) => {
  externalApiCalls
    .getMatryxPlatformInfo(latestVersion)
    .then(result => {
      let { abi } = result
      res.status(200).json({ abi })
    })
    .catch(errorHelper(res, 'Error getting latest ABI'))
})

// Return a confirmation the API is live
router.get('/getInfo/:version', (req, res, next) => {
  let { version } = req.params

  externalApiCalls
    .getMatryxPlatformInfo(version)
    .then(result => {
      let { address } = result['networks']['777']
      let { abi } = result
      res.status(200).json({ address, abi })
    })
    .catch(errorHelper(res, 'Error getting info for: ' + version))
})

// Return a confirmation the API is live
router.get('/getAddress/:version', (req, res, next) => {
  let { version } = req.params

  externalApiCalls
    .getMatryxPlatformAddress(version)
    .then(result => {
      let { address } = result['networks']['777']
      res.status(200).json({ address })
    })
    .catch(errorHelper(res, 'Error getting address for: ' + version))
})

// Return a confirmation the API is live
router.get('/getAbi/:version', (req, res, next) => {
  let { version } = req.params

  externalApiCalls
    .getMatryxPlatformAbi(version)
    .then(result => {
      let { abi } = result
      res.status(200).json({ abi })
    })
    .catch(errorHelper(res, 'Error getting ABI for: ' + version))
})

// Return a confirmation the API is live
router.get('/getTopCategories', (req, res, next) => {
  matryxPlatformCalls
    .getTopCategories()
    .then(categories => res.status(200).json({ categories }))
    .catch(errorHelper(res, 'Error getting top categories'))
})

module.exports = router
