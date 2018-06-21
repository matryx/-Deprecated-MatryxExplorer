/*
MatryxExplorer API routing for all tournament based REST calls

author - sam@nanome.ai
Copyright Nanome Inc 2018
*/

const express = require('express')
const tournamentController = require('../controllers/tournamentController')
const roundController = require('../controllers/roundController')
const externalApiCalls = require('../controllers/gateway/externalApiCalls')
const ethHelper = require('../helpers/ethHelper')
const router = express.Router()
let latestVersion = process.env.PLATFORM_VERSION

// inputs: response object and optional error log message
// output: error method that takes in error and sends over response
const errorHelper = (res, log) => err => {
  if (log) console.log(log)
  res.status(500).json({ errorMsg: err.message })
}

// inputs: response object and address to validate
// output: true if address valid
const validateAddress = (res, address) => {
  if (!ethHelper.isAddress(address)) {
    res.status(500).json({
      errorMsg: 'This is not a valid ethereum address'
    })
    return false
  }
  return true
}

// Return a confirmation the API is live
router.get('/', (req, res, next) => {
  tournamentController
    .getAllTournaments()
    .then(data => res.status(200).json({ data }))
    .catch(errorHelper(res, 'Error loading the tournaments'))
})

router.get('/getLatestAbi', (req, res, next) => {
  externalApiCalls
    .getMatryxTournamentAbi(latestVersion)
    .then(({ abi }) => res.status(200).json({ abi }))
    .catch(errorHelper(res, 'Error loading the ABI'))
})

// TODO: add error response for invalid responses
router.get('/getAbi/:version', (req, res, next) => {
  let { version } = req.params
  externalApiCalls
    .getMatryxTournamentAbi(version)
    .then(({ abi }) => res.status(200).json({ abi }))
    .catch(errorHelper(res, 'Error loading the ABI'))
})

// Return number of tournaments
router.get('/count', (req, res, next) => {
  tournamentController
    .count()
    .then(tournamentCount => res.status(200).json({ tournamentCount }))
    .catch(errorHelper(res, 'Error getting tournament count'))
})

// TODO: is this route needed? identical to /
router.get('/allTournaments', (req, res, next) => {
  tournamentController
    .getAllTournaments()
    .then(data => res.status(200).json({ data }))
    .catch(errorHelper(res, 'Error loading the tournaments'))
})

// Return the tournament details for a specific tournament
// TODO pass back the tournament details
router.get('/address/:tournamentAddress', (req, res, next) => {
  const { tournamentAddress } = req.params
  if (!validateAddress(res, tournamentAddress)) return

  tournamentController
    .getTournamentByAddress(tournamentAddress)
    .then(tournamentDetails => res.status(200).json({ tournamentDetails }))
    .catch(errorHelper(res))
})

// Return the tournament owner for a specific tournament
router.get('/address/:tournamentAddress/getOwner', async (req, res, next) => {
  const { tournamentAddress } = req.params
  if (!validateAddress(res, tournamentAddress)) return

  tournamentController
    .getTournamentOwnerByAddress(tournamentAddress)
    .then(tournamentOwner => {
      res.status(200).json({
        tournamentOwner,
        tournamentAddress
      })
    })
    .catch(errorHelper(res))
})

// Return the submission count for a specific tournament
router.get('/address/:tournamentAddress/submissionCount', (req, res, next) => {
  const { tournamentAddress } = req.params
  if (!validateAddress(res, tournamentAddress)) return

  tournamentController
    .getSubmissionCount(tournamentAddress)
    .then(results => res.status(200).json({ results }))
    .catch(errorHelper(res))
})

// TODO: Waiting on Max, need to implement the Round is open in order to access this
// Current Round response given a tournamentAddress
router.get('/address/:tournamentAddress/currentRound', (req, res, next) => {
  const { tournamentAddress } = req.params
  if (!validateAddress(res, tournamentAddress)) return

  tournamentController
    .getCurrentRound(tournamentAddress)
    .then(currentRound => res.status(200).json({ currentRound }))
    .catch(errorHelper(res))
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
    let data = await roundController.getRoundDetails(roundAddress)
    res.status(200).json({ data })
  } catch (err) {
    errorHelper(res)(err)
  }
})

// Return if the potentantial address given is an entrant for a specific tournament
router.get('/address/:tournamentAddress/isEntrant/:address', (req, res, next) => {
  const { tournamentAddress, address } = req.params
  if (!validateAddress(res, tournamentAddress) || !validateAddress(res, address)) return

  tournamentController
    .isEntrant(tournamentAddress, address)
    .then(isEntrant => {
      res.status(200).json({
        isEntrant,
        tournamentAddress
      })
    })
    .catch(errorHelper(res))
})

// Return if the potentantial address given is an entrant for a specific tournament
router.get('/address/:tournamentAddress/allRoundAddresses', (req, res, next) => {
  const { tournamentAddress } = req.params
  if (!validateAddress(res, tournamentAddress)) return

  tournamentController
    .getAllRoundAddresses(tournamentAddress)
    .then(addresses => {
      res.status(200).json({
        addresses,
        tournamentAddress
      })
    })
    .catch(errorHelper(res))
})

// Return if the potentantial address given is an entrant for a specific tournament
router.get('/category/:category', (req, res, next) => {
  const { category } = req.params
  tournamentController
    .getTournamentsByCategory(category)
    .then(addresses => res.status(200).json({ addresses }))
    .catch(errorHelper(res, 'Error getting ' + category + ' tournaments'))
})

// Return if the potentantial address given is an entrant for a specific tournament
router.get('/address/:tournamentAddress/isCreator/:address', (req, res, next) => {
  const { tournamentAddress, address } = req.params
  if (!validateAddress(res, tournamentAddress) || !validateAddress(res, address)) return

  tournamentController
    .isCreator(tournamentAddress, address)
    .then(result => res.status(200).json({ result }))
    .catch(errorHelper(res, 'Error checking isCreator'))
})

/*
#################################
These are all TEST or HELPER functions
#################################
*/

// // Temp NO IPFS
// // Return a confirmation the API is live
// router.get('/', (req, res, next) => {
//   tournamentController.getAllTournamentsNoIpfs().then(function (tournaments) {
//     res.status(200).json({
//       data: tournaments
//     })
//   })
// })
//

// // TEMP IPFS DOWN
// // Return the tournament details for a specific tournament
// // TODO pass back the tournament details
// router.get('/address/:tournamentAddress', (req, res, next) => {
//   const address = req.params.tournamentAddress
//   tournamentController.getTournamentByAddressNoIPFS(address).then(function (result) {
//     res.status(200).json({
//       tournamentDetails: result
//     })
//   }).catch((err) => {
//     res.status(300).json({
//       error: 'Unable to find tournament',
//       errorMsg: err.name
//     })
//   })
// })

// router.post('/', (req, res, next) => {
//     res.status(200).json({
//         message: 'handling POST requests to /products'
//     });
// });

/*
#################################
These are all EXPERIMENTAL functions
#################################
*/

module.exports = router

// TODO Swagger integration
