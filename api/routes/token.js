/*
MatryxExplorer API routing for all tournament based REST calls

author - sam@nanome.ai
Copyright Nanome Inc 2018
*/

const express = require('express')
const token = require('../../data/matryxToken')

const router = express.Router()

// Return a confirmation the API is live
router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'handling requests to /MatryxToken'
  })
})

// Return a confirmation the API is live
router.get('/getAbi', (req, res, next) => {
  try {
    res.status(200).json({
      abi: token.abi
    })
  } catch (err) {
    res.status(500).json({
      errMsg: err.message
    })
  }
})

// Return number of tournaments
router.get('/getAddress', (req, res, next) => {
  try {
    res.status(200).json({
      address: token.address
    })
  } catch (err) {
    res.status(500).json({
      errMsg: err.message
    })
  }
})

// Return number of tournaments
router.get('/getLatestInfo', (req, res, next) => {
  try {
    res.status(200).json({
      address: token.address,
      abi: token.abi
    })
  } catch (err) {
    res.status(500).json({
      errMsg: err.message
    })
  }
})

module.exports = router
