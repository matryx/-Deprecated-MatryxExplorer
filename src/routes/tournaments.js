/**
 * tournaments.js
 * /tournaments routes for getting Tournament info
 *
 * Authors sam@nanome.ai dev@nanome.ai
 * Copyright (c) 2018, Nanome Inc
 * Licensed under ISC. See LICENSE.md in project root.
 */

const router = require('express').Router()

const tournamentController = require('../controllers/tournamentController')
const roundController = require('../controllers/roundController')
const { getVoteDistribution } = require('../../db/serviceVote')
const { errorHelper, validateAddress, validateTournament } = require('../helpers/responseHelpers')
const asyncWrap = require('../middleware/asyncWrap')

const abis = require('../helpers/getAbis')

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
router.get('/address/:tournamentAddress', asyncWrap(async (req, res, next) => {
  const { tournamentAddress } = req.params
  try {
    if (!await validateTournament(next, tournamentAddress)) return

    const [tournament, voteDistribution,] = await Promise.all([
      tournamentController.getTournamentByAddress(tournamentAddress),
      getVoteDistribution({ recipient: tournamentAddress })
    ])
    tournament.voteDistribution = voteDistribution

    return res.status(200).json({ tournament })
  } catch (error) {
    errorHelper(next, `Error getting Tournament ${tournamentAddress}`)
  }
}))

// Return the tournament owner for a specific tournament
router.get('/address/:tournamentAddress/owner', asyncWrap(async (req, res, next) => {
  const { tournamentAddress } = req.params
  if (!await validateTournament(next, tournamentAddress)) return

  tournamentController
    .getTournamentOwnerByAddress(tournamentAddress)
    .then(owner => res.status(200).json({ owner }))
    .catch(errorHelper(next, `Error getting ${tournamentAddress} owner`))
}))

// Return the submission count for a specific tournament
router.get('/address/:tournamentAddress/submissionCount', asyncWrap(async (req, res, next) => {
  const { tournamentAddress } = req.params
  if (!await validateTournament(next, tournamentAddress)) return

  tournamentController
    .getSubmissionCount(tournamentAddress)
    .then(submissionCount => res.status(200).json({ submissionCount }))
    .catch(errorHelper(next, `Error getting Tournament ${tournamentAddress} Submission count`))
}))

// Current Round response given a tournamentAddress
router.get('/address/:tournamentAddress/currentRound', asyncWrap(async (req, res, next) => {
  const { tournamentAddress } = req.params
  if (!await validateTournament(next, tournamentAddress)) return

  tournamentController
    .getCurrentRound(tournamentAddress)
    .then(currentRound => res.status(200).json({ currentRound }))
    .catch(errorHelper(next, `Error getting Tournament ${tournamentAddress} current round`))
}))

router.get('/address/:tournamentAddress/round/:roundIndex', asyncWrap(async (req, res, next) => {
  const { tournamentAddress, roundIndex } = req.params
  if (!await validateTournament(next, tournamentAddress)) return

  // TODO: Clean the input for the correct response
  // TODO: Check to see how many rounds are in the tournament
  // TODO: check to see if the round is even open at all

  try {
    let roundAddress = await tournamentController.getRoundAddress(tournamentAddress, roundIndex)
    let round = await roundController.getRoundDetails(roundAddress)
    res.status(200).json({ round })
  } catch (err) {
    // istanbul ignore next
    errorHelper(next, `Error getting Tournament ${tournamentAddress} Round ${roundIndex}`)(err)
  }
}))

// Return if the potentantial address given is an entrant for a specific tournament
router.get('/address/:tournamentAddress/isEntrant/:address', asyncWrap(async (req, res, next) => {
  const { tournamentAddress, address } = req.params
  if (!await validateTournament(next, tournamentAddress)) return
  if (!validateAddress(next, address)) return

  tournamentController
    .isEntrant(tournamentAddress, address)
    .then(isEntrant => res.status(200).json({ isEntrant }))
    .catch(errorHelper(next, `Error checking if ${address} is entrant of ${tournamentAddress}`))
}))

// Return if the potentantial address given is an entrant for a specific tournament
router.get('/address/:tournamentAddress/rounds', asyncWrap(async (req, res, next) => {
  const { tournamentAddress } = req.params
  if (!await validateTournament(next, tournamentAddress)) return

  tournamentController
    .getAllRoundAddresses(tournamentAddress)
    .then(rounds => res.status(200).json({ rounds }))
    .catch(errorHelper(next, `Error getting Tournament ${tournamentAddress} Round addresses`))
}))

module.exports = router

// TODO Swagger integration
