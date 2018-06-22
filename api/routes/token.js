/*
MatryxExplorer API routing for all tournament based REST calls

author - sam@nanome.ai
Copyright Nanome Inc 2018
*/

const express = require('express')
const router = express.Router()

const token = require('../../data/matryxToken')

// Return a confirmation the API is live
router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'handling requests to /MatryxToken'
  })
})

// Return a confirmation the API is live
router.get('/getAbi', (req, res, next) => {
  res.status(200).json({ abi: token.abi })
})

// Return number of tournaments
router.get('/getAddress', (req, res, next) => {
  res.status(200).json({ address: token.address })
})

// Return number of tournaments
router.get('/getLatestInfo', (req, res, next) => {
  res.status(200).json({
    address: token.address,
    abi: token.abi
  })
})

module.exports = router
