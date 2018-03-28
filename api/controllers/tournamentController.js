/*
The Matryx Tournament controller

authors - sam@nanome.ai
Nanome 2018
*/

/*
Imports
*/
const externalApiCalls = require('./gateway/externalApiCalls')
const platformCalls = require('./gateway/platformCalls')

let tournamentController = {}

tournamentController.count = function () {
  return new Promise((resolve, reject) => {
    resolve(platformCalls.getTournamentCount())
  })
}

tournamentController.getAllTournaments = function () {
  return new Promise((resolve, reject) => {
    let responses = []

    platformCalls.getAllTournaments().then(function (result) {
        // assign the output to the the responses
      console.log(result)
      result.forEach((tournament) => {
        tournament.tournamentDescription = 'The description should be here, but since max did not pass in the correct IPFS hash I cant get it for you. Sorry, dude'
        tournament.externalAddress = 'QmYdbXBhekWjoTu3kKYb7NLJFy6bG9USCP6TVAPm8hhQ7e'
        tournament.category = 'Other'
        /*
        // TODO: take the extenal address
        externalAddress = tournament.externalAddress
        //call the IPFS getter for the value
        ipfsCalls.getDescriptionFromHash(externalAddress).then(function(result){
        tournament.tournamentDescription = result
        })

        //
        */
        responses.push(tournament)
      })
      resolve(result)
    }).catch((err) => {
      console.log('Not able to retrieve all tournaments. ' + err)
    })
  })
}

tournamentController.getTournamentByAddress = function (_tournamentAddress) {
  return new Promise((resolve, reject) => {
    platformCalls.getTournamentByAddress(_tournamentAddress).then(function (result) {
      // let description = externalApiCalls.getIpfsData(result.externalAddress)
      result.tournamentDescription = 'description'
      resolve(result)
    }).catch((err) => {
      console.log('Not able to get Tournament Details. ' + err)
    })
  })
}

tournamentController.getTournamentOwnerByAddress = function (_tournamentAddress) {
  return new Promise((resolve, reject) => {
    platformCalls.getTournamentOwnerByAddress(_tournamentAddress).then(function (result) {
      resolve(result)
    }).catch((err) => {
      console.log('Not able to retrieve tournament owner. ' + err)
    })
  })
}

tournamentController.getSubmissionCount = function (_tournamentAddress) {
  return new Promise((resolve, reject) => {
    platformCalls.getSubmissionCount(_tournamentAddress).then(function (result) {
      resolve(result)
    }).catch((err) => {
      console.log('Not able to retrieve submission count. ' + err)
    })
  })
}

tournamentController.getSubmissionCount = function (_tournamentAddress) {
  return new Promise((resolve, reject) => {
    platformCalls.getSubmissionCount(_tournamentAddress).then(function (result) {
      resolve(result)
    }).catch((err) => {
      console.log('Not able to retrieve submission count. ' + err)
    })
  })
}

tournamentController.getLatestRound = function (_tournamentAddress) {
  return new Promise((resolve, reject) => {
    platformCalls.getCurrentRoundFromTournamentAddress(_tournamentAddress).then(function (result) {
      resolve(result)
    }).catch((err) => {
      console.log('Not able to retrieve latest round. ' + err)
    })
  })
}

tournamentController.isEntrant = function (_tournamentAddress, _potentialEntrantAddress) {
  return new Promise((resolve, reject) => {
    platformCalls.isTournamentEntrant(_tournamentAddress, _potentialEntrantAddress).then(function (result) {
      resolve(result)
    }).catch((err) => {
      console.log('Not able to retrieve latest round. ' + err)
    })
  })
}

module.exports = tournamentController
