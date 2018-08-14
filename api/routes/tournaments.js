/*
MatryxExplorer API routing for all tournament based REST calls

author - sam@nanome.ai
Copyright Nanome Inc 2018
*/

const express = require('express')
const router = express.Router()

const tournamentController = require('../controllers/tournamentController')
const roundController = require('../controllers/roundController')
const externalApiCalls = require('../controllers/gateway/externalApiCalls')
const { errorHelper, validateAddress } = require('../helpers/responseHelpers')

const latestVersion = process.env.PLATFORM_VERSION

// Return a confirmation the API is live
router.get('/', (req, res, next) => {
  tournamentController
    .getAllTournaments(req.query)
    .then(tournaments => res.status(200).json({ tournaments }))
    .catch(errorHelper(res, 'Error getting tournaments'))
})

router.get('/getLatestAbi', (req, res, next) => {
  externalApiCalls
    .getMatryxTournamentAbi(latestVersion)
    .then(({ abi }) => res.status(200).json({ abi }))
    .catch(errorHelper(res, 'Error getting latest ABI'))
})

// TODO: add error response for invalid responses
router.get('/getAbi/:version', (req, res, next) => {
  let { version } = req.params
  externalApiCalls
    .getMatryxTournamentAbi(version)
    .then(({ abi }) => res.status(200).json({ abi }))
    .catch(errorHelper(res, 'Error getting ABI for ' + version))
})

// Return number of tournaments
router.get('/count', (req, res, next) => {
  tournamentController
    .count()
    .then(count => res.status(200).json({ count }))
    .catch(errorHelper(res, 'Error getting tournament count'))
})

// Return the tournament details for a specific tournament
// TODO pass back the tournament details
router.get('/address/:tournamentAddress', (req, res, next) => {
  const { tournamentAddress } = req.params
  if (!validateAddress(res, tournamentAddress)) return

  tournamentController
    .getTournamentByAddress(tournamentAddress)
    .then(tournament => res.status(200).json({ tournament }))
    .catch(errorHelper(res, 'Error getting tournament ' + tournamentAddress))
})

// Return the tournament owner for a specific tournament
router.get('/address/:tournamentAddress/getOwner', async (req, res, next) => {
  const { tournamentAddress } = req.params
  if (!validateAddress(res, tournamentAddress)) return

  tournamentController
    .getTournamentOwnerByAddress(tournamentAddress)
    .then(owner => res.status(200).json({ owner }))
    .catch(errorHelper(res, 'Error getting owner of ' + tournamentAddress))
})

// Return the submission count for a specific tournament
router.get('/address/:tournamentAddress/submissionCount', (req, res, next) => {
  const { tournamentAddress } = req.params
  if (!validateAddress(res, tournamentAddress)) return

  tournamentController
    .getSubmissionCount(tournamentAddress)
    .then(submissionCount => res.status(200).json({ submissionCount }))
    .catch(errorHelper(res, 'Error getting submission count for ' + tournamentAddress))
})

// TODO: Waiting on Max, need to implement the Round is open in order to access this
// Current Round response given a tournamentAddress
router.get('/address/:tournamentAddress/currentRound', (req, res, next) => {
  const { tournamentAddress } = req.params
  if (!validateAddress(res, tournamentAddress)) return

  tournamentController
    .getCurrentRound(tournamentAddress)
    .then(currentRound => res.status(200).json({ currentRound }))
    .catch(errorHelper(res, 'Error getting current round for ' + tournamentAddress))
})

router.get('/address/:tournamentAddress/round/:roundId', async (req, res, next) => {
  const { tournamentAddress, roundId } = req.params
  if (!validateAddress(res, tournamentAddress)) return

  console.log('>TournamentRouter: Retrieving Round Details for round ' + roundId + ' of tournmament' + tournamentAddress)

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
    errorHelper(res, 'Error getting round ' + roundId + ' of ' + tournamentAddress)(err)
  }
})

// Return if the potentantial address given is an entrant for a specific tournament
router.get('/address/:tournamentAddress/isEntrant/:address', (req, res, next) => {
  const { tournamentAddress, address } = req.params
  if (!validateAddress(res, tournamentAddress) || !validateAddress(res, address)) return

  tournamentController
    .isEntrant(tournamentAddress, address)
    .then(isEntrant => res.status(200).json({ isEntrant }))
    .catch(errorHelper(res, 'Error checking if ' + address + ' is entrant of ' + tournamentAddress))
})

// Return if the potentantial address given is an entrant for a specific tournament
router.get('/address/:tournamentAddress/allRoundAddresses', (req, res, next) => {
  const { tournamentAddress } = req.params
  if (!validateAddress(res, tournamentAddress)) return

  tournamentController
    .getAllRoundAddresses(tournamentAddress)
    .then(rounds => res.status(200).json({ rounds }))
    .catch(errorHelper(res, 'Error getting all round addresses for ' + tournamentAddress))
})

// Return if the potentantial address given is an entrant for a specific tournament
router.get('/category/:category', (req, res, next) => {
  const { category } = req.params
  tournamentController
    .getTournamentsByCategory(category)
    .then(tournaments => res.status(200).json({ tournaments }))
    .catch(errorHelper(res, 'Error getting tournaments for ' + category))
})

// Return if the potentantial address given is an entrant for a specific tournament
router.get('/address/:tournamentAddress/isCreator/:address', (req, res, next) => {
  const { tournamentAddress, address } = req.params
  if (!validateAddress(res, tournamentAddress) || !validateAddress(res, address)) return

  tournamentController
    .isCreator(tournamentAddress, address)
    .then(isCreator => res.status(200).json({ isCreator }))
    .catch(errorHelper(res, 'Error checking if ' + address + ' is creator of ' + tournamentAddress))
})

module.exports = router

// TODO Swagger integration
