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

const latestVersion = process.env.PLATFORM_VERSION
const networkId = process.env.NETWORK_ID

let Platform
require('../helpers/getAbis').then(async abis => {
  const { platform } = abis
  Platform = new MatryxPlatform(platform.address, platform.abi)

  let count = +await Platform.getTournamentCount()
  console.log(`\nCurrent Matryx Platform Address in use: ${platform.address}`)
  console.log(`There are ${count} tournaments on the Platform.\n`)
})

// Return a message that this route handles all platform specific requests
router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'handling GET requests to /platform'
  })
})

router.get('/getInfo/:version?', (req, res, next) => {
  let version = req.params.version || latestVersion

  externalApiCalls
    .getMatryxPlatformInfo(version)
    .then(result => {
      let { address } = result['networks'][networkId]
      let { abi } = result
      res.status(200).json({ address, abi })
    })
    .catch(errorHelper(res, 'Error getting info for ' + version))
})

router.get('/getAddress/:version?', (req, res, next) => {
  let version = req.params.version || latestVersion

  externalApiCalls
    .getMatryxPlatformInfo(version)
    .then(result => {
      let { address } = result['networks'][networkId]
      res.status(200).json({ address })
    })
    .catch(errorHelper(res, 'Error getting address for ' + version))
})

router.get('/getAbi/:version?', (req, res, next) => {
  let version = req.params.version || latestVersion

  externalApiCalls
    .getMatryxPlatformInfo(version)
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
