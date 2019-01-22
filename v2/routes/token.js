/**
 * token.js
 * /token routes for getting Token info
 *
 * Authors sam@nanome.ai dev@nanome.ai
 * Copyright (c) 2018, Nanome Inc
 * Licensed under ISC. See LICENSE.md in project root.
 */

const express = require('express')
const router = express.Router()

const externalApiCalls = require('../controllers/gateway/externalApiCalls')
const { errorHelper } = require('../helpers/responseHelpers')

const networkId = process.env.NETWORK_ID || "3" // Ropsten

// Return a confirmation the API is live
router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'handling GET requests to /token'
  })
})

router.get('/getInfo/:version?', (req, res, next) => {
  const { version } = req.params

  externalApiCalls
    .getMatryxTokenInfo(version)
    .then(result => {
      let { address } = result['networks'][networkId]
      let { abi } = result
      res.status(200).json({ address, abi })
    })
    .catch(errorHelper(next, 'Error getting Token info'))
})

router.get('/getAddress/:version?', (req, res, next) => {
  const { version } = req.params

  externalApiCalls
    .getMatryxTokenInfo(version)
    .then(result => {
      let { address } = result['networks'][networkId]
      res.status(200).json({ address })
    })
    .catch(errorHelper(next, 'Error getting Token address'))
})

router.get('/getAbi/:version?', (req, res, next) => {
  const { version } = req.params

  externalApiCalls
    .getMatryxTokenInfo(version)
    .then(result => {
      let { abi } = result
      res.status(200).json({ abi })
    })
    .catch(errorHelper(next, 'Error getting Token ABI'))
})

module.exports = router
