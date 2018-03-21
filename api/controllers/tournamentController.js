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
          // Loop through each response and get the IPFS hash
          // Make an IPFS call to retrieve the description and/or image
        let description = externalApiCalls.getIpfsData(tournament.externalAddress)
          // Pass the descriptions back into the responses
        tournament.tournamentDescription = description
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
      let description = externalApiCalls.getIpfsData(result.externalAddress)
      result.tournamentDescription = description
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

module.exports = tournamentController
