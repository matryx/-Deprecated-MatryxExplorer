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

let tournamentController = {}

tournamentController.count = function () {
  return new Promise((resolve, reject) => {
    resolve(matryxPlatformCalls.getTournamentCount())
  })
}

tournamentController.getAllTournaments = function () {
  return new Promise((resolve, reject) => {
    let responses = []

    // Get all the tournament addresses
    matryxPlatformCalls.getAllTournamentAddresses().then(function (tournamentAddresses) {
      console.log(tournamentAddresses)
      for (i = 0; i < tournamentAddresses.length; i++) {
        tournamentAddress = tournamentAddresses[i]
        console.log(tournamentAddress)

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

// TODO: submissions call
// TODO: getDescription only when max gives back a correct hash-> also error handle for this.

tournamentController.getTournamentByAddress = function (_tournamentAddress) {
  console.log('Executing TournamentController for getting Tournament details at: ' + _tournamentAddress)
  return new Promise((resolve, reject) => {
    let responses = []
    let tournamentDataCalls = []
    let submissions = []

    let tournamentData = {
      tournamentTitle: '',
      tournamentAdddress: '',
      mtx: 0,
      authorName: '',
      tournamentDescription: '',
      category: '',
      totalRounds: 0,
      currentRound: 0,
      currentRoundAddress: '',
      numberOfParticipants: 0,
      ipType: '',
      roundEndTime: '',
      participationMTX: 0,
      roundReward: 0,
      externalAddress: '',
      submissions: []
    }
    let submission = {
      submissionTitle: '',
      submissionAuthor: '',
      submissionDate: ''
    }

    tournamentDataCalls.push(matryxPlatformCalls.getTournamentTitle(_tournamentAddress))
    tournamentDataCalls.push(matryxPlatformCalls.getTournamentBounty(_tournamentAddress))
    tournamentDataCalls.push(matryxPlatformCalls.getTournamentOwner(_tournamentAddress))
        // tournamentDataCalls.push(matryxPlatformCalls.getTournamentDescription(tournamentAddress))   //Waiting for max to give me a valid reponse for the external Address
    tournamentDataCalls.push(matryxPlatformCalls.getTournamentCategory(_tournamentAddress))
    tournamentDataCalls.push(matryxPlatformCalls.getTournamentMaxRounds(_tournamentAddress))
    tournamentDataCalls.push(matryxPlatformCalls.currentRoundOfTournament(_tournamentAddress))
    tournamentDataCalls.push(matryxPlatformCalls.currentRoundAddressOfTournament(_tournamentAddress))
    tournamentDataCalls.push(matryxPlatformCalls.entrantCountOfTournament(_tournamentAddress))
    tournamentDataCalls.push(matryxPlatformCalls.getCurrentRoundEndTimeFromTournament(_tournamentAddress))
    tournamentDataCalls.push(matryxPlatformCalls.getEntryFeeOfTournament(_tournamentAddress))
    tournamentDataCalls.push(matryxPlatformCalls.getExternalAddressTournament(_tournamentAddress))
    // tournamentDataCalls.push(matryxPlatformCalls.getSubmissionsFromTournament(_tournamentAddress)) // TODO:

            // Promise all for the data inside the tournaments
    Promise.all(tournamentDataCalls).then(function (values) {
            // Attach to the tournament Data
      tournamentData.tournamentTitle = values[0]
      tournamentData.tournamentAdddress = _tournamentAddress
      tournamentData.mtx = values[1]
      tournamentData.authorName = values[2]
      tournamentData.tournamentDescription = 'Waiting for valid IPFS hash'
      tournamentData.category = values[3]
      tournamentData.totalRounds = values[4]
      tournamentData.currentRound = values[5]
      tournamentData.currentRoundAddress = values[6]
      tournamentData.numberOfParticipants = values[7]
      tournamentData.ipType = ''
      tournamentData.roundEndTime = values[8]
      tournamentData.participationMTX = values[9]
      tournamentData.externalAddress = values[10]
          // tournamentData.submissions = values[10]

      resolve(tournamentData)
      responses.push(tournamentData)
    })
  })
}

tournamentController.getTournamentOwnerByAddress = function (_tournamentAddress) {
  return new Promise((resolve, reject) => {
    matryxPlatformCalls.getTournamentOwner(_tournamentAddress).then(function (result) {
      resolve(result)
    }).catch((err) => {
      console.log('Not able to retrieve tournament owner. ' + err)
    })
  })
}

tournamentController.getSubmissionCount = function (_tournamentAddress) {
  return new Promise((resolve, reject) => {
    matryxPlatformCalls.submissionsCountOfTournament(_tournamentAddress).then(function (result) {
      resolve(result)
    }).catch((err) => {
      console.log('Not able to retrieve submission count. ' + err)
    })
  })
}

tournamentController.getCurrentRound = function (_tournamentAddress) {
  return new Promise((resolve, reject) => {
    matryxPlatformCalls.currentRoundOfTournament(_tournamentAddress).then(function (result) {
      resolve(result)
    }).catch((err) => {
      console.log('Not able to retrieve submission count. ' + err)
    })
  })
}

tournamentController.isEntrant = function (_tournamentAddress, _potentialEntrantAddress) {
  return new Promise((resolve, reject) => {
    matryxPlatformCalls.isEntrantToTournament(_tournamentAddress, _potentialEntrantAddress).then(function (result) {
      resolve(result)
    }).catch((err) => {
      console.log('Not able to retrieve latest round. ' + err)
    })
  })
}

tournamentController.getAllRoundAddresses = function (_tournamentAddress) {
  return new Promise((resolve, reject) => {
    matryxPlatformCalls.getAllRoundAddresses(_tournamentAddress).then(function (result) {
      resolve(result)
    }).catch((err) => {
      console.log('Not able to retrieve latest round. ' + err)
    })
  })
}

tournamentController.getRoundAddress = function (_tournamentAddress, _roundId) {
  return new Promise((resolve, reject) => {
    matryxPlatformCalls.getRoundAddressByIndex(_tournamentAddress, _roundId).then(function (result) {
      resolve(result)
    }).catch((err) => {
      console.log('Not able to retrieve latest round. ' + err)
    })
  })
}

module.exports = tournamentController
