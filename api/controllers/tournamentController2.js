/*
The Matryx Tournament controller

authors - sam@nanome.ai
Nanome 2018
*/

/*
Imports
*/
const externalApiCalls = require('./gateway/externalApiCalls')
const matryxPlatformCalls = require('./gateway/matryxPlatformCalls')

let tournamentController2 = {}

tournamentController2.count = function () {
  return new Promise((resolve, reject) => {
    resolve(matryxPlatformCalls.getTournamentCount())
  })
}

tournamentController2.getAllTournaments = function () {
  return new Promise((resolve, reject) => {
    let responses = []

    // Get all the tournament addresses
    matryxPlatformCalls.getAllTournamentAddresses().then(function (tournamentAddresses) {
      for (i = 0; i < tournamentAddresses.length; i++) {
        tournamentAddress = tournamentAddresses[i]
        let tournamentDataCalls = []
        let tournamentData = {
          tournamentTitle: '',
          mtx: 0,
          tournamentDescription: '',
          category: '',
          totalRounds: 0,
          currentRound: 0,
          numberOfParticipants: 0,
          address: '',
          ipType: '',
          tournamentId: '',
          externalAddress: ''
        }

        tournamentDataCalls.push(matryxPlatformCalls.getTournamentTitle(tournamentAddress))
        tournamentDataCalls.push(matryxPlatformCalls.getTournamentBounty(tournamentAddress))
        // tournamentDataCalls.push(matryxPlatformCalls.getTournamentDescription(tournamentAddress))   //Waiting for max to give me a valid reponse for the external Address
        tournamentDataCalls.push(matryxPlatformCalls.getTournamentCategory(tournamentAddress))
        tournamentDataCalls.push(matryxPlatformCalls.getTournamentMaxRounds(tournamentAddress))
        tournamentDataCalls.push(matryxPlatformCalls.currentRoundOfTournament(tournamentAddress))
        tournamentDataCalls.push(matryxPlatformCalls.entrantCountOfTournament(tournamentAddress))
        tournamentDataCalls.push(matryxPlatformCalls.getExternalAddressTournament(tournamentAddress))

            // Promise all for the data inside the tournaments
        Promise.all(tournamentDataCalls).then(function (values) {
            // Attach to the tournament Data
          tournamentData.tournamentTitle = values[0]
          tournamentData.mtx = values[1]
          tournamentData.tournamentDescription = 'Filler Description until Max gives me a valid hash'
          tournamentData.category = values[2]
          tournamentData.totalRounds = values[3]
          tournamentData.currentRound = values[4]
          tournamentData.numberOfParticipants = values[5]
          tournamentData.address = tournamentAddress
          tournamentData.ipType = ''
          tournamentData.tournamentId = ''
          tournamentData.externalAddress = values[6]

          responses.push(tournamentData)
          if (responses.length == tournamentAddresses.length) {
            resolve(responses)
          }
          console.log(values)
        })
      }
    })
  })
}

/*
OLD STUFFS
*/
//
// tournamentController.getAllTournaments = function () {
//   return new Promise((resolve, reject) => {
//     let responses = []
//
//     platformCalls.getAllTournaments().then(function (result) {
//         // assign the output to the the responses
//       console.log(result)
//       result.forEach((tournament) => {
//         tournament.tournamentDescription = 'The description should be here, but since max did not pass in the correct IPFS hash I cant get it for you. Sorry, dude'
//         tournament.externalAddress = 'QmYdbXBhekWjoTu3kKYb7NLJFy6bG9USCP6TVAPm8hhQ7e'
//         tournament.category = 'Other'
//         /*
//         // TODO: take the extenal address
//         externalAddress = tournament.externalAddress
//         //call the IPFS getter for the value
//         ipfsCalls.getDescriptionFromHash(externalAddress).then(function(result){
//         tournament.tournamentDescription = result
//         })
//
//         //
//         */
//         responses.push(tournament)
//       })
//       resolve(result)
//     }).catch((err) => {
//       console.log('Not able to retrieve all tournaments. ' + err)
//     })
//   })
// }
//
// tournamentController.getTournamentByAddress = function (_tournamentAddress) {
//   return new Promise((resolve, reject) => {
//     platformCalls.getTournamentByAddress(_tournamentAddress).then(function (result) {
//       // let description = externalApiCalls.getIpfsData(result.externalAddress)
//       result.tournamentDescription = 'description'
//       resolve(result)
//     }).catch((err) => {
//       console.log('Not able to get Tournament Details. ' + err)
//     })
//   })
// }
//
// tournamentController.getTournamentOwnerByAddress = function (_tournamentAddress) {
//   return new Promise((resolve, reject) => {
//     platformCalls.getTournamentOwnerByAddress(_tournamentAddress).then(function (result) {
//       resolve(result)
//     }).catch((err) => {
//       console.log('Not able to retrieve tournament owner. ' + err)
//     })
//   })
// }
//
// tournamentController.getSubmissionCount = function (_tournamentAddress) {
//   return new Promise((resolve, reject) => {
//     platformCalls.getSubmissionCount(_tournamentAddress).then(function (result) {
//       resolve(result)
//     }).catch((err) => {
//       console.log('Not able to retrieve submission count. ' + err)
//     })
//   })
// }
//
// tournamentController.getSubmissionCount = function (_tournamentAddress) {
//   return new Promise((resolve, reject) => {
//     platformCalls.getSubmissionCount(_tournamentAddress).then(function (result) {
//       resolve(result)
//     }).catch((err) => {
//       console.log('Not able to retrieve submission count. ' + err)
//     })
//   })
// }
//
// tournamentController.getLatestRound = function (_tournamentAddress) {
//   return new Promise((resolve, reject) => {
//     platformCalls.getCurrentRoundFromTournamentAddress(_tournamentAddress).then(function (result) {
//       resolve(result)
//     }).catch((err) => {
//       console.log('Not able to retrieve latest round. ' + err)
//     })
//   })
// }
//
// tournamentController.isEntrant = function (_tournamentAddress, _potentialEntrantAddress) {
//   return new Promise((resolve, reject) => {
//     platformCalls.isTournamentEntrant(_tournamentAddress, _potentialEntrantAddress).then(function (result) {
//       resolve(result)
//     }).catch((err) => {
//       console.log('Not able to retrieve latest round. ' + err)
//     })
//   })
// }

module.exports = tournamentController2
