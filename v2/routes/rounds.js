/**
 * rounds.js
 * /rounds routes for getting Round info
 *
 * Authors sam@nanome.ai dev@nanome.ai
 * Copyright (c) 2018, Nanome Inc
 * Licensed under ISC. See LICENSE.md in project root.
 */

const express = require('express')
const router = express.Router()

const config = require('../../config')
const externalApiCalls = require('../controllers/gateway/externalApiCalls')
const roundController = require('../controllers/roundController')
const { errorHelper, validateAddress } = require('../helpers/responseHelpers')

const latestVersion = config.PLATFORM_VERSION

// Return a list of all rounds
router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'handling GET requests to /rounds'
  })
})

router.get('/getAbi/:version?', (req, res, next) => {
  // istanbul ignore next
  let version = req.params.version || latestVersion

  externalApiCalls
    .getMatryxRoundAbi(version)
    .then(({ abi }) => res.status(200).json({ abi }))
    .catch(errorHelper(next, `Error getting Round ABI for ${version}`))
})

router.get('/address/:roundAddress', (req, res, next) => {
  let { roundAddress } = req.params
  if (!validateAddress(next, roundAddress)) return

  roundController
    .getRoundDetails(roundAddress)
    .then(round => res.status(200).json({ round }))
    .catch(errorHelper(next, `Error getting Round ${roundAddress}`))
})

module.exports = router
