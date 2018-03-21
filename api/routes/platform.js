/*
MatryxExplorer API routing for all platform based REST calls

author - sam@nanome.ai
Copyright Nanome Inc 2018
*/

// TODO versioning api calls for the abi and latest platform info

const express = require('express')
const router = express.Router()

const ethPlatform = require('../controllers/gateway/platformCalls')
const platformController = require('../controllers/platformController')

// Return a message that this route handles all platform specific requests
router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'handling GET requests to /platform'
  })
})

// TODO fix this one...showing up as undefined due to scope
// Return a message that this route handles all platform specific requests
router.get('/latestInfo', (req, res, next) => {
  response = platformController.latestPlatformInfo()
  res.status(200).json({
    platformAddress: response.address,
    platformAbi: response.abi
  })
})

router.get('/address', (req, res, next) => {
  response = platformController.latestPlatformInfo()
  res.status(200).json({
    platformAddress: response.address
  })
})

router.get('/abi', (req, res, next) => {
  response = platformController.latestPlatformInfo()
  res.status(200).json({
    platformAbi: response.abi
  })
})

// router.post('/', (req, res, next) => {
//     res.status(200).json({
//         message: 'handling POST requests to /products'
//     });
// });

module.exports = router
