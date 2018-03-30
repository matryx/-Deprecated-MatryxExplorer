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
const externalApiCalls = require('../controllers/gateway/externalApiCalls')

// TODO: get from .env
let latestVersion = 'v2'

// Return a message that this route handles all platform specific requests
router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'handling GET requests to /platform'
  })
})

// TODO fix this one...showing up as undefined due to scope
// Return a message that this route handles all platform specific requests
router.get('/getLatestInfo', (req, res, next) => {
  try {
    externalApiCalls.getMatryxPlatformInfo(latestVersion).then(function (resultingInfo) {
      res.status(200).json({
        address: resultingInfo.address,
        abi: resultingInfo.abi
      })
    })
  } catch (err) {
    console.log('Error loading the ABI')
    res.status(200).json({
      errorMessage: 'Sorry, that version does not exist.',
      error: err
    })
  }
})

router.get('/getLatestAddress', (req, res, next) => {
  try {
    externalApiCalls.getMatryxPlatformInfo(latestVersion).then(function (resultingInfo) {
      res.status(200).json({
        address: resultingInfo.address
      })
    })
  } catch (err) {
    console.log('Error loading the ABI')
    res.status(200).json({
      errorMessage: 'Sorry, that version does not exist.',
      error: err
    })
  }
})

router.get('/getLatestAbi', (req, res, next) => {
  try {
    externalApiCalls.getMatryxPlatformInfo(latestVersion).then(function (resultingInfo) {
      res.status(200).json({
        abi: resultingInfo.abi
      })
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
router.get('/getInfo/:version', (req, res, next) => {
  let version = req.params.version
  try {
    externalApiCalls.getMatryxPlatformAbi(version).then(function (resultingInfo) {
      res.status(200).json({
        address: resultingInfo.address,
        abi: resultingInfo.abi
      })
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
    externalApiCalls.getMatryxPlatformAddress(version).then(function (resultingAddress) {
      res.status(200).json({
        address: resultingAddress
      })
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
    externalApiCalls.getMatryxPlatformAbi(version).then(function (resultingAbi) {
      res.status(200).json({
        abi: resultingAbi.abi
      })
    })
  } catch (err) {
    console.log('Error loading the ABI')
    res.status(200).json({
      errorMessage: 'Sorry, that version does not exist.',
      error: err
    })
  }
})

module.exports = router
