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
  let tokenData = token
  res.status(200).json({
    tokenAbi: tokenData.abi
  })
})

// Return number of tournaments
router.get('/getAddress', (req, res, next) => {
  let tokenData = token
  res.status(200).json({
    tokenAddress: tokenData.address
  })
})

// Return number of tournaments
router.get('/getLatestInfo', (req, res, next) => {
  let tokenData = token

  res.status(200).json({
    tokenAddress: tokenData.address,
    tokenAbi: tokenData.abi
  })
})

module.exports = router

// TODO Swagger integration
