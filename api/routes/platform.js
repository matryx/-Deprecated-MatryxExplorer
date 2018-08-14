/*
MatryxExplorer API routing for all platform based REST calls

author - sam@nanome.ai
Copyright Nanome Inc 2018
*/

// TODO versioning api calls for the abi and latest platform info

const express = require('express')
const router = express.Router()

const externalApiCalls = require('../controllers/gateway/externalApiCalls')
const { errorHelper } = require('../helpers/responseHelpers')

const MatryxPlatform = require('../contracts/MatryxPlatform')

let Platform
require('../helpers/getAbis').then(async abis => {
  Platform = new MatryxPlatform(abis.platform.address, abis.platform.abi)
  let count = +await Platform.getTournamentCount()
  console.log(`\nCurrent Matryx Platform Address in use: ${abis.platform.address}`)
  console.log(`There are ${count} tournaments on the Platform.\n`)
})

const latestVersion = process.env.PLATFORM_VERSION
const networkId = process.env.NETWORK_ID

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
      let { address } = result['networks'][networkId]
      let { abi } = result
      res.status(200).json({ address, abi })
    })
    .catch(errorHelper(res, 'Error getting latest info'))
})

router.get('/getLatestAddress', (req, res, next) => {
  externalApiCalls
    .getMatryxPlatformInfo(latestVersion)
    .then(result => {
      let { address } = result['networks'][networkId]
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
      let { address } = result['networks'][networkId]
      let { abi } = result
      res.status(200).json({ address, abi })
    })
    .catch(errorHelper(res, 'Error getting info for ' + version))
})

// Return a confirmation the API is live
router.get('/getAddress/:version', (req, res, next) => {
  let { version } = req.params

  externalApiCalls
    .getMatryxPlatformAddress(version)
    .then(result => {
      let { address } = result['networks'][networkId]
      res.status(200).json({ address })
    })
    .catch(errorHelper(res, 'Error getting address for ' + version))
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
    .catch(errorHelper(res, 'Error getting ABI for ' + version))
})

router.get('/getAllCategories', (req, res, next) => {
  Platform
    .getAllCategories()
    .then(categories => res.status(200).json({ categories }))
    .catch(errorHelper(res, 'Error getting top categories'))
})

module.exports = router
