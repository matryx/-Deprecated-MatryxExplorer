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

const roundController = require('../controllers/roundController')
const { errorHelper, validateRound } = require('../helpers/responseHelpers')
const asyncWrap = require('../middleware/asyncWrap')

const abis = require('../helpers/getAbis')

// Return a list of all rounds
router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'handling GET requests to /rounds'
  })
})

router.get('/getAbi', (req, res, next) => {
  res.status(200).json(abis.round)
})

router.get('/address/:roundAddress', asyncWrap(async (req, res, next) => {
  let { roundAddress } = req.params
  if (!await validateRound(next, roundAddress)) return

  roundController
    .getRoundDetails(roundAddress)
    .then(round => res.status(200).json({ round }))
    .catch(errorHelper(next, `Error getting Round ${roundAddress}`))
}))

module.exports = router
