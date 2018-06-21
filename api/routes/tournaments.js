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

// Return a confirmation the API is live
router.get('/', (req, res, next) => {
  try {
    tournamentController.getAllTournaments().then(function (tournaments) {
      res.status(200).json({
        data: tournaments
      })
    })
  } catch (err) {
    console.log('Error loading the tournaments')
    res.status(500).json({
      errorMsg: err.message
    })
  }
})

router.get('/getLatestAbi', (req, res, next) => {
  try {
    externalApiCalls.getMatryxTournamentAbi(latestVersion).then(function (resultingAbi) {
      // console.log(resultingAbi)
      res.status(200).json({
        abi: resultingAbi.abi
      })
    })
  } catch (err) {
    console.log('Error loading the ABI')
    res.status(500).json({
      errorMsg: err.message
    })
  }
})

// TODO: add error response for invalid responses
router.get('/getAbi/:version', (req, res, next) => {
  let version = req.params.version
  try {
    externalApiCalls.getMatryxTournamentAbi(version).then(function (resultingAbi) {
      // console.log(resultingAbi)
      res.status(200).json({
        abi: resultingAbi.abi
      })
    })
  } catch (err) {
    console.log('Error loading the ABI')
    res.status(500).json({
      errorMsg: err.message
    })
  }
})

// Return number of tournaments
router.get('/count', (req, res, next) => {
  tournamentController.count().then(function (result) {
    res.status(200).json({
      tournamentCount: result
    })
  }).catch(function (err) {
    console.log(err)
    res.status(500).json({
      errorMsg: err.message
    })
  })
})

// Return number of tournaments
router.get('/allTournaments', (req, res, next) => {
  tournamentController.getAllTournaments().then(function (tournaments) {
    res.status(200).json({
      data: tournaments
    })
  }).catch(function (err) {
    console.log(err)
    res.status(500).json({
      errorMsg: err.message
    })
  })
})

// // Return all of the tournaments
// router.get('/allTournaments', (req, res, next) => {
//     // TODO replace function with working model+final name
//   tournamentController.getAllTournaments().then(function (tournaments) {
//     res.status(200).json({
//       data: tournaments
//     })
//   })
// })

// Return the tournament details for a specific tournament
// TODO pass back the tournament details
router.get('/address/:tournamentAddress', (req, res, next) => {
  const address = req.params.tournamentAddress

  if (!ethHelper.isAddress(address)) {
    res.status(500).json({
      errorMsg: 'This is not a valid ethereum address'
    })
  } else {
    try {
      tournamentController.getTournamentByAddress(address).then(function (result) {
        res.status(200).json({
          tournamentDetails: result
        })
      }).catch(function (err) {
        res.status(500).json({
          errorMsg: err.message
        })
      })
    } catch (err) {
      res.status(500).json({
        errorMsg: err.message
      })
    }
  }
})

// Return the tournament owner for a specific tournament
router.get('/address/:tournamentAddress/getOwner', (req, res, next) => {
  const address = req.params.tournamentAddress
  if (!ethHelper.isAddress(address)) {
    res.status(500).json({
      errorMsg: 'This is not a valid ethereum address'
    })
  } else {
    tournamentController.getTournamentOwnerByAddress(address).then(function (result) {
      res.status(200).json({
        tournamentOwner: result,
        tournamentAddress: address
      })
    }).catch((err) => {
      res.status(500).json({
        errorMsg: err.message
      })
    })
  }
})

// Return the submission count for a specific tournament
router.get('/address/:tournamentAddress/submissionCount', (req, res, next) => {
  const address = req.params.tournamentAddress
  if (!ethHelper.isAddress(address)) {
    res.status(500).json({
      errorMsg: 'This is not a valid ethereum address'
    })
  } else {
    tournamentController.getSubmissionCount(address).then(function (result) {
      res.status(200).json({
        results: result
      })
    }).catch((err) => {
      res.status(500).json({
        errorMsg: err.message
      })
    })
  }
})

// TODO: Waiting on Max, need to implement the Round is open in order to access this
// Current Round response given a tournamentAddress
router.get('/address/:tournamentAddress/currentRound', (req, res, next) => {
  const address = req.params.tournamentAddress
  if (!ethHelper.isAddress(address)) {
    res.status(500).json({
      errorMsg: 'This is not a valid ethereum address'
    })
  } else {
    tournamentController.getCurrentRound(address).then(function (result) {
      res.status(200).json({
        currentRound: result
      })
    }).catch((err) => {
      res.status(500).json({
        errorMsg: err.message
      })
    })
  }
})

router.get('/address/:tournamentAddress/round/:roundId', (req, res, next) => {
  const tournamentAddress = req.params.tournamentAddress
  const roundId = req.params.roundId
  if (!ethHelper.isAddress(tournamentAddress)) {
    res.status(500).json({
      errorMsg: 'This is not a valid ethereum address'
    })
  } else {
    console.log('>TournamentRouter: Retrieving Round Details for round ' + roundId + ' of tournmament' + tournamentAddress)

  // TODO: Clean the input for the correct response
// TODO: Check to see how many rounds are in the tournament
// TODO: check to see if the round is even open at all

    // tournamentController.numberOfRounds(tournamentAddress).then(function(roundCount){
    //     if(roundId)
    // })

    tournamentController.getRoundAddress(tournamentAddress, roundId).then(function (roundAddress) {
      console.log('The round address is: ' + roundAddress)
      try {
        roundController.getRoundDetails(roundAddress).then(function (_roundDetails) {
          res.status(200).json({
            data: _roundDetails
          })
        })
      } catch (err) {
        res.status(500).json({
          errorMsg: err.message
        })
      }
    }).catch((err) => {
      res.status(500).json({
        errorMsg: err.message
      })
    })
  }
})

// Return if the potentantial address given is an entrant for a specific tournament
router.get('/address/:tournamentAddress/isEntrant/:potentialEntrantAddress', (req, res, next) => {
  const tournamentAddress = req.params.tournamentAddress
  const potentialEntrantAddress = req.params.potentialEntrantAddress
  if (!ethHelper.isAddress(tournamentAddress) || !ethHelper.isAddress(potentialEntrantAddress)) {
    res.status(500).json({
      errorMsg: 'This is not a valid ethereum address'
    })
  } else {
    tournamentController.isEntrant(tournamentAddress, potentialEntrantAddress).then(function (result) {
      res.status(200).json({
        isEntrant: result,
        tournamentAddress: tournamentAddress
      })
    }).catch((err) => {
      res.status(500).json({
        errorMsg: err.message
      })
    })
  }
})

// Return if the potentantial address given is an entrant for a specific tournament
router.get('/address/:tournamentAddress/allRoundAddresses', (req, res, next) => {
  const tournamentAddress = req.params.tournamentAddress
  if (!ethHelper.isAddress(tournamentAddress)) {
    res.status(500).json({
      errorMsg: 'This is not a valid ethereum address'
    })
  } else {
    tournamentController.getAllRoundAddresses(tournamentAddress).then(function (result) {
      res.status(200).json({
        addresses: result,
        tournamentAddress: tournamentAddress
      })
    }).catch((err) => {
      res.status(500).json({
        errorMsg: err.message
      })
    })
  }
})

// Return if the potentantial address given is an entrant for a specific tournament
router.get('/category/:category', (req, res, next) => {
  const category = req.params.category
  tournamentController.getTournamentsByCategory(category).then(function (result) {
    res.status(200).json({
      addresses: result
    })
  }).catch((err) => {
    console.log(err)
    res.status(500).json({
      errorMessage: err.message
    })
  })
})

// Return if the potentantial address given is an entrant for a specific tournament
router.get('/address/:tournamentAddress/isCreator/:userAddress', (req, res, next) => {
  const tournamentAddress = req.params.tournamentAddress
  const userAddress = req.params.userAddress

  tournamentController.isCreator(tournamentAddress, userAddress).then(function (creatorBool) {
    res.status(200).json({
      result: creatorBool
    })
  }).catch((err) => {
    console.log(err)
    res.status(500).json({
      errorMessage: err.message
    })
  })
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
