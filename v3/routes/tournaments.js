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
const { getVotes } = require('../../db/serviceVote')
const { errorHelper, validateAddress, validateTournament } = require('../helpers/responseHelpers')

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
router.get('/address/:tournamentAddress', async (req, res, next) => {
  try {
    const { tournamentAddress } = req.params
    if (!await validateTournament(next, tournamentAddress)) return

    const [tournament, votes] = await Promise.all([
      tournamentController.getTournamentByAddress(tournamentAddress),
      getVotes({ recipient: tournamentAddress })
    ])
    tournament.votes = votes

    return res.status(200).json({ tournament })
  } catch (error) {
    errorHelper(next, `Error getting Tournament ${tournamentAddress}`)
  }
})

// Return the tournament owner for a specific tournament
router.get('/address/:tournamentAddress/owner', async (req, res, next) => {
  const { tournamentAddress } = req.params
  if (!await validateTournament(next, tournamentAddress)) return

  tournamentController
    .getTournamentOwnerByAddress(tournamentAddress)
    .then(owner => res.status(200).json({ owner }))
    .catch(errorHelper(next, `Error getting ${tournamentAddress} owner`))
})

// Return the submission count for a specific tournament
router.get('/address/:tournamentAddress/submissionCount', async (req, res, next) => {
  const { tournamentAddress } = req.params
  if (!await validateTournament(next, tournamentAddress)) return

  tournamentController
    .getSubmissionCount(tournamentAddress)
    .then(submissionCount => res.status(200).json({ submissionCount }))
    .catch(errorHelper(next, `Error getting Tournament ${tournamentAddress} Submission count`))
})

// Current Round response given a tournamentAddress
router.get('/address/:tournamentAddress/currentRound', async (req, res, next) => {
  const { tournamentAddress } = req.params
  if (!await validateTournament(next, tournamentAddress)) return

  tournamentController
    .getCurrentRound(tournamentAddress)
    .then(currentRound => res.status(200).json({ currentRound }))
    .catch(errorHelper(next, `Error getting Tournament ${tournamentAddress} current round`))
})

router.get('/address/:tournamentAddress/round/:roundId', async (req, res, next) => {
  const { tournamentAddress, roundId } = req.params
  if (!await validateTournament(next, tournamentAddress)) return

  // TODO: Clean the input for the correct response
  // TODO: Check to see how many rounds are in the tournament
  // TODO: check to see if the round is even open at all

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
router.get('/address/:tournamentAddress/isEntrant/:address', async (req, res, next) => {
  const { tournamentAddress, address } = req.params
  if (!await validateTournament(next, tournamentAddress)) return
  if (!validateAddress(next, address)) return

  tournamentController
    .isEntrant(tournamentAddress, address)
    .then(isEntrant => res.status(200).json({ isEntrant }))
    .catch(errorHelper(next, `Error checking if ${address} is entrant of ${tournamentAddress}`))
})

// Return if the potentantial address given is an entrant for a specific tournament
router.get('/address/:tournamentAddress/rounds', async (req, res, next) => {
  const { tournamentAddress } = req.params
  if (!await validateTournament(next, tournamentAddress)) return

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
