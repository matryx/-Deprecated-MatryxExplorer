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
router.get('/getLatestInfo', (req, res, next) => {
  response = platformController.latestPlatformInfo()
  res.status(200).json({
    platformAddress: response.address,
    platformAbi: response.abi
  })
})

router.get('/getLatestAddress', (req, res, next) => {
  response = platformController.latestPlatformInfo()
  res.status(200).json({
    platformAddress: response.address
  })
})

router.get('/getLatestAbi', (req, res, next) => {
  response = platformController.latestPlatformInfo()
  res.status(200).json({
    platformAbi: response.abi
  })
})

// Return a confirmation the API is live
router.get('/getInfo/:version', (req, res, next) => {
  let version = req.params.version
  try {
    let rAbi = require('../../data/abi/' + version + '/platform')
    res.status(200).json({
      address: rAbi.address,
      abi: rAbi.abi
    })
  } catch (err) {
    console.log('Error loading the ABI')
    res.status(200).json({
      errorMessage: 'Sorry, that version does not exist.',
      error: err
    })
  }
})
// Return a confirmation the API is live
router.get('/getAddress/:version', (req, res, next) => {
  let version = req.params.version
  try {
    let rAbi = require('../../data/abi/' + version + '/platform')
    res.status(200).json({
      address: rAbi.address
    })
  } catch (err) {
    console.log('Error loading the ABI')
    res.status(200).json({
      errorMessage: 'Sorry, that version does not exist.',
      error: err
    })
  }
})

// Return a confirmation the API is live
router.get('/getAbi/:version', (req, res, next) => {
  let version = req.params.version
  try {
    let rAbi = require('../../data/abi/' + version + '/platform')
    res.status(200).json({
      abi: rAbi.abi
    })
  } catch (err) {
    console.log('Error loading the ABI')
    res.status(200).json({
      errorMessage: 'Sorry, that version does not exist.',
      error: err
    })
  }
})

// router.post('/', (req, res, next) => {
//     res.status(200).json({
//         message: 'handling POST requests to /products'
//     });
// });

module.exports = router
