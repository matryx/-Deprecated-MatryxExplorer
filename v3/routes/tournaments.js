/**
 * tournaments.js
 * /tournaments routes for getting Tournament info
 *
 * Authors sam@nanome.ai dev@nanome.ai
 * Copyright (c) 2018, Nanome Inc
 * Licensed under ISC. See LICENSE.md in project root.
 */

const express = require('express')
const router = express.Router()

const tournamentController = require('../controllers/tournamentController')
const roundController = require('../controllers/roundController')
const { errorHelper, validateAddress } = require('../helpers/responseHelpers')

const MatryxPlatform = require('../contracts/MatryxPlatform')
const abis = require('../helpers/getAbis')

let Platform, lastUpdate

// before each call, check if Platform updated
router.use((req, res, next) => {
  if (lastUpdate !== abis.lastUpdate) {
    Platform = new MatryxPlatform(abis.platform.address, abis.platform.abi)
    tournamentController.setPlatform(Platform)
    lastUpdate = abis.lastUpdate
  }

  next()
})

// Return a confirmation the API is live
router.get('/', (req, res, next) => {
  tournamentController
    .getTournaments(req.query)
    .then(tournaments => res.status(200).json({ tournaments }))
    .catch(errorHelper(next, 'Error getting Tournaments'))
})

// TODO: add error response for invalid responses
router.get('/getAbi', (req, res, next) => {
  res.status(200).json(abis.tournament)
})

// Return number of tournaments
router.get('/count', (req, res, next) => {
  tournamentController
    .count()
    .then(count => res.status(200).json({ count }))
    .catch(errorHelper(next, 'Error getting Tournament count'))
})

// Return the tournament details for a specific tournament
router.get('/address/:tournamentAddress', (req, res, next) => {
  const { tournamentAddress } = req.params
  if (!validateAddress(next, tournamentAddress)) return

  tournamentController
    .getTournamentByAddress(tournamentAddress)
    .then(tournament => res.status(200).json({ tournament }))
    .catch(errorHelper(next, `Error getting Tournament ${tournamentAddress}`))
})

// Return the tournament owner for a specific tournament
router.get('/address/:tournamentAddress/owner', (req, res, next) => {
  const { tournamentAddress } = req.params
  if (!validateAddress(next, tournamentAddress)) return

  tournamentController
    .getTournamentOwnerByAddress(tournamentAddress)
    .then(owner => res.status(200).json({ owner }))
    .catch(errorHelper(next, `Error getting ${tournamentAddress} owner`))
})

// Return the submission count for a specific tournament
router.get('/address/:tournamentAddress/submissionCount', (req, res, next) => {
  const { tournamentAddress } = req.params
  if (!validateAddress(next, tournamentAddress)) return

  tournamentController
    .getSubmissionCount(tournamentAddress)
    .then(submissionCount => res.status(200).json({ submissionCount }))
    .catch(errorHelper(next, `Error getting Tournament ${tournamentAddress} Submission count`))
})

// Current Round response given a tournamentAddress
router.get('/address/:tournamentAddress/currentRound', (req, res, next) => {
  const { tournamentAddress } = req.params
  if (!validateAddress(next, tournamentAddress)) return

  tournamentController
    .getCurrentRound(tournamentAddress)
    .then(currentRound => res.status(200).json({ currentRound }))
    .catch(errorHelper(next, `Error getting Tournament ${tournamentAddress} current round`))
})

router.get('/address/:tournamentAddress/round/:roundId', async (req, res, next) => {
  const { tournamentAddress, roundId } = req.params
  if (!validateAddress(next, tournamentAddress)) return

  // TODO: Clean the input for the correct response
  // TODO: Check to see how many rounds are in the tournament
  // TODO: check to see if the round is even open at all

  // tournamentController.numberOfRounds(tournamentAddress).then(function(roundCount){
  //     if(roundId)
  // })

  try {
    let roundAddress = await tournamentController.getRoundAddress(tournamentAddress, roundId)
    let round = await roundController.getRoundDetails(roundAddress)
    res.status(200).json({ round })
  } catch (err) {
    // istanbul ignore next
    errorHelper(next, `Error getting Tournament ${tournamentAddress} Round ${roundId}`)(err)
  }
})

// Return if the potentantial address given is an entrant for a specific tournament
router.get('/address/:tournamentAddress/isEntrant/:address', (req, res, next) => {
  const { tournamentAddress, address } = req.params
  if (!validateAddress(next, tournamentAddress) || !validateAddress(next, address)) return

  tournamentController
    .isEntrant(tournamentAddress, address)
    .then(isEntrant => res.status(200).json({ isEntrant }))
    .catch(errorHelper(next, `Error checking if ${address} is entrant of ${tournamentAddress}`))
})

// Return if the potentantial address given is an entrant for a specific tournament
router.get('/address/:tournamentAddress/rounds', (req, res, next) => {
  const { tournamentAddress } = req.params
  if (!validateAddress(next, tournamentAddress)) return

  tournamentController
    .getAllRoundAddresses(tournamentAddress)
    .then(rounds => res.status(200).json({ rounds }))
    .catch(errorHelper(next, `Error getting Tournament ${tournamentAddress} Round addresses`))
})

// Return if the potentantial address given is an entrant for a specific tournament
router.get('/category/:category', (req, res, next) => {
  const { category } = req.params
  tournamentController
    .getTournamentsByCategory(category)
    .then(tournaments => res.status(200).json({ tournaments }))
    .catch(errorHelper(next, `Error getting Tournaments for category ${category}`))
})

module.exports = router

// TODO Swagger integration
