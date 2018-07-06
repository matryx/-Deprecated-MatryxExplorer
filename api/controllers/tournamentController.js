/*
The Matryx Tournament controller

authors - sam@nanome.ai
Nanome 2018
*/

/*
Imports
*/

const matryxPlatformCalls = require('./gateway/matryxPlatformCalls')

let tournamentController = {}

tournamentController.count = () => {
  return matryxPlatformCalls.getTournamentCount()
}

tournamentController.getAllTournaments = async (query) => {
  // Get all the tournament addresses
  let addresses = await matryxPlatformCalls.getAllTournamentAddresses()

  if (query && query.owner) {
    // get all tournament owners, then filter addresses by owner
    let promises = addresses.map(address => (async () => {
      let owner = await matryxPlatformCalls.getTournamentOwner(address)
      return { owner, address }
    })())

    let addressesWithOwner = await Promise.all(promises)
    addresses = addressesWithOwner
      .filter(t => t.owner === query.owner)
      .map(t => t.address)
  }

  let promises = addresses.map(address => (async () => {
    // TODO: remove either totalRounds or currentRound; they are the same
    // let ts = Date.now()
    let data = await Promise.all([
      matryxPlatformCalls.getTournamentTitle(address),
      matryxPlatformCalls.getTournamentBounty(address),
      matryxPlatformCalls.getTournamentOwner(address),
      matryxPlatformCalls.getTournamentDescription(address),
      matryxPlatformCalls.getTournamentCategory(address),
      matryxPlatformCalls.currentRoundOfTournament(address),
      matryxPlatformCalls.entrantCountOfTournament(address),
      matryxPlatformCalls.getFolderHashTournament(address)
    ])
    // console.log(address, 'took', Date.now() - ts, 'ms')

    let [
      tournamentTitle,
      mtx,
      tournamentOwner,
      tournamentDescription,
      category,
      currentRound,
      numberOfParticipants,
      folderHash
    ] = data

    return {
      address,
      tournamentOwner,
      tournamentTitle,
      tournamentDescription,
      folderHash,
      category,
      mtx,
      ipType: '',
      currentRound,
      numberOfParticipants
    }
  })())

  return await Promise.all(promises)
}

// TODO: submissions call
// TODO: getDescription only when max gives back a correct hash-> also error handle for this.

tournamentController.getTournamentByAddress = async (tournamentAddress) => {
  console.log('Executing TournamentController for getting Tournament details at: ' + tournamentAddress)

  const data = await Promise.all([
    matryxPlatformCalls.getTournamentTitle(tournamentAddress),
    matryxPlatformCalls.getTournamentRemainingMtx(tournamentAddress),
    matryxPlatformCalls.getTournamentBounty(tournamentAddress),
    matryxPlatformCalls.getTournamentOwner(tournamentAddress),
    matryxPlatformCalls.getTournamentDescription(tournamentAddress),
    matryxPlatformCalls.getTournamentCategory(tournamentAddress),
    matryxPlatformCalls.currentRoundOfTournament(tournamentAddress),
    matryxPlatformCalls.currentRoundAddressOfTournament(tournamentAddress),
    matryxPlatformCalls.entrantCountOfTournament(tournamentAddress),
    matryxPlatformCalls.getCurrentRoundEndTimeFromTournament(tournamentAddress),
    matryxPlatformCalls.getEntryFeeOfTournament(tournamentAddress),
    matryxPlatformCalls.getFolderHashTournament(tournamentAddress)
    // matryxPlatformCalls.getSubmissionsFromTournament(tournamentAddress)) // TODO:
  ])

  let [
    tournamentTitle,
    remainingMtx,
    mtx,
    authorName,
    tournamentDescription,
    category,
    currentRound,
    currentRoundAddress,
    numberOfParticipants,
    roundEndTime,
    participationMTX,
    folderHash
    // submissions
  ] = data

  return {
    tournamentAddress,
    authorName,
    tournamentTitle,
    tournamentDescription,
    folderHash,
    category,
    ipType: '',
    mtx,
    remainingMtx,
    currentRound,
    currentRoundAddress,
    roundEndTime,
    numberOfParticipants,
    participationMTX
    // submissions
  }
}

tournamentController.getTournamentOwnerByAddress = (tournamentAddress) => {
  return matryxPlatformCalls.getTournamentOwner(tournamentAddress)
}

tournamentController.getSubmissionCount = (tournamentAddress) => {
  return matryxPlatformCalls.submissionsCountOfTournament(tournamentAddress)
}

tournamentController.getCurrentRound = (tournamentAddress) => {
  return matryxPlatformCalls.currentRoundOfTournament(tournamentAddress)
}

tournamentController.isEntrant = (tournamentAddress, potentialEntrantAddress) => {
  return matryxPlatformCalls.isEntrantToTournament(tournamentAddress, potentialEntrantAddress)
}

tournamentController.getAllRoundAddresses = (tournamentAddress) => {
  return matryxPlatformCalls.getAllRoundAddresses(tournamentAddress)
}

// TODO roundId-1 here because ID is 1-based, index is 0-based
tournamentController.getRoundAddress = (tournamentAddress, roundId) => {
  return matryxPlatformCalls.getRoundAddressByIndex(tournamentAddress, roundId)
}

tournamentController.getTournamentsByCategory = (category) => {
  return matryxPlatformCalls.getTournamentsByCategory(category)
}

tournamentController.isCreator = (tournamentAddress, userAddress) => {
  return matryxPlatformCalls.isTournamentCreator(tournamentAddress, userAddress)
}

/*
Experiemental or testing methods
*/
//
// tournamentController.getAllTournamentsNoIpfs = function () {
//   return new Promise((resolve, reject) => {
//     let responses = []
//
//     // Get all the tournament addresses
//     matryxPlatformCalls.getAllTournamentAddresses().then(function (tournamentAddresses) {
//       console.log(tournamentAddresses)
//       for (i = 0; i < tournamentAddresses.length; i++) {
//         let tournamentAddress = tournamentAddresses[i]
//         console.log(tournamentAddress)
//
//         let tournamentDataCalls = []
//         let tournamentData = {
//           tournamentTitle: '',
//           mtx: 0,
//           tournamentDescription: '',
//           category: '',
//           totalRounds: 0,
//           currentRound: 0,
//           numberOfParticipants: 0,
//           address: '',
//           ipType: '',
//           tournamentId: '',
//           externalAddress: ''
//         }
//
//         tournamentDataCalls.push(matryxPlatformCalls.getTournamentTitle(tournamentAddress))
//         tournamentDataCalls.push(matryxPlatformCalls.getTournamentBounty(tournamentAddress))
//         // tournamentDataCalls.push(matryxPlatformCalls.getTournamentDescription(tournamentAddress))
//         tournamentDataCalls.push(matryxPlatformCalls.getTournamentCategory(tournamentAddress))
//         tournamentDataCalls.push(matryxPlatformCalls.getTournamentMaxRounds(tournamentAddress))
//         tournamentDataCalls.push(matryxPlatformCalls.currentRoundOfTournament(tournamentAddress))
//         tournamentDataCalls.push(matryxPlatformCalls.entrantCountOfTournament(tournamentAddress))
//         tournamentDataCalls.push(matryxPlatformCalls.getExternalAddressTournament(tournamentAddress))
//
//             // Promise all for the data inside the tournaments
//         Promise.all(tournamentDataCalls).then(function (values) {
//             // Attach to the tournament Data
//           tournamentData.tournamentTitle = values[0]
//           tournamentData.mtx = values[1]
//           // tournamentData.tournamentDescription = values[2]
//           tournamentData.tournamentDescription = 'This is a filler tournament description'
//
//           tournamentData.category = values[2]
//           tournamentData.totalRounds = values[3]
//           tournamentData.currentRound = values[4]
//           tournamentData.numberOfParticipants = values[5]
//           tournamentData.address = tournamentAddress
//           tournamentData.ipType = ''
//           tournamentData.tournamentId = ''
//           tournamentData.externalAddress = values[6]
//
//           responses.push(tournamentData)
//           if (responses.length == tournamentAddresses.length) {
//             resolve(responses)
//           }
//           console.log(values)
//         })
//       }
//     }).catch(function (err) {
//       console.log(err.message)
//       reject(err)
//     })
//   })
// }

// // TEMP NO IPFS
// tournamentController.getTournamentByAddressNoIPFS = function (_tournamentAddress) {
//   console.log('Executing TournamentController for getting Tournament details at: ' + _tournamentAddress)
//   return new Promise((resolve, reject) => {
//     let responses = []
//     let tournamentDataCalls = []
//     let submissions = []
//
//     let tournamentData = {
//       tournamentTitle: '',
//       tournamentAddress: '',
//       mtx: 0,
//       authorName: '',
//       tournamentDescription: '',
//       category: '',
//       totalRounds: 0,
//       currentRound: 0,
//       currentRoundAddress: '',
//       numberOfParticipants: 0,
//       ipType: '',
//       roundEndTime: '',
//       participationMTX: 0,
//       roundReward: 0,
//       externalAddress: '',
//       submissions: []
//     }
//     let submission = {
//       submissionTitle: '',
//       submissionAuthor: '',
//       submissionDate: ''
//     }
//
//     tournamentDataCalls.push(matryxPlatformCalls.getTournamentTitle(_tournamentAddress))
//     tournamentDataCalls.push(matryxPlatformCalls.getTournamentBounty(_tournamentAddress))
//     tournamentDataCalls.push(matryxPlatformCalls.getTournamentOwner(_tournamentAddress))
//     // tournamentDataCalls.push(matryxPlatformCalls.getTournamentDescription(_tournamentAddress))
//     tournamentDataCalls.push(matryxPlatformCalls.getTournamentCategory(_tournamentAddress))
//     tournamentDataCalls.push(matryxPlatformCalls.getTournamentMaxRounds(_tournamentAddress))
//     tournamentDataCalls.push(matryxPlatformCalls.currentRoundOfTournament(_tournamentAddress))
//     tournamentDataCalls.push(matryxPlatformCalls.currentRoundAddressOfTournament(_tournamentAddress))
//     tournamentDataCalls.push(matryxPlatformCalls.entrantCountOfTournament(_tournamentAddress))
//     tournamentDataCalls.push(matryxPlatformCalls.getCurrentRoundEndTimeFromTournament(_tournamentAddress))
//     tournamentDataCalls.push(matryxPlatformCalls.getEntryFeeOfTournament(_tournamentAddress))
//     tournamentDataCalls.push(matryxPlatformCalls.getExternalAddressTournament(_tournamentAddress))
//     // tournamentDataCalls.push(matryxPlatformCalls.getSubmissionsFromTournament(_tournamentAddress)) // TODO:
//
//             // Promise all for the data inside the tournaments
//     Promise.all(tournamentDataCalls).then(function (values) {
//             // Attach to the tournament Data
//       console.log(values)
//       tournamentData.tournamentTitle = values[0]
//       tournamentData.tournamentAddress = _tournamentAddress
//       tournamentData.mtx = values[1]
//       tournamentData.authorName = values[2]
//       // tournamentData.tournamentDescription = values[3]
//       tournamentData.tournamentDescription = 'This is a filler description for now, IPFS is turned off'
//       tournamentData.category = values[3]
//       tournamentData.totalRounds = values[4]
//       tournamentData.currentRound = values[5]
//       tournamentData.currentRoundAddress = values[6]
//       tournamentData.numberOfParticipants = values[7]
//       tournamentData.ipType = ''
//       tournamentData.roundEndTime = values[8]
//       tournamentData.participationMTX = values[9]
//       tournamentData.externalAddress = values[10]
//           // tournamentData.submissions = values[10]
//
//       resolve(tournamentData)
//       responses.push(tournamentData)
//     })
//   })
// }

// tournamentController.getAllTournamentsAsync = async function () {
//   try {
//     let responses = []
//     let tournamentAddresses = await matryxPlatformCalls.getAllTournamentAddresses()
//     if (tournamentAddresses) {
//       for (i = 0; i < tournamentAddresses.length; i++) {
//         let tournamentAddress = tournamentAddresses[i]
//               // console.log(tournamentAddress)
//
//         let tournamentDataCalls = []
//         let tournamentData = {
//           tournamentTitle: '',
//           mtx: 0,
//           tournamentDescription: '',
//           category: '',
//           totalRounds: 0,
//           currentRound: 0,
//           numberOfParticipants: 0,
//           address: '',
//           ipType: '',
//           tournamentId: '',
//           externalAddress: ''
//         }
//
//         tournamentDataCalls.push(matryxPlatformCalls.getTournamentTitle(tournamentAddress))
//         tournamentDataCalls.push(matryxPlatformCalls.getTournamentBounty(tournamentAddress))
//         tournamentDataCalls.push(matryxPlatformCalls.getTournamentDescription(tournamentAddress))
//         tournamentDataCalls.push(matryxPlatformCalls.getTournamentCategory(tournamentAddress))
//         tournamentDataCalls.push(matryxPlatformCalls.getTournamentMaxRounds(tournamentAddress))
//         tournamentDataCalls.push(matryxPlatformCalls.currentRoundOfTournament(tournamentAddress))
//         tournamentDataCalls.push(matryxPlatformCalls.entrantCountOfTournament(tournamentAddress))
//         tournamentDataCalls.push(matryxPlatformCalls.getExternalAddressTournament(tournamentAddress))
//
//         // TODO: Add error handling for promise all responses
//               // Promise all for the data inside the tournaments
//         Promise.all(tournamentDataCalls).then(function (values) {
//               // Attach to the tournament Data
//           tournamentData.tournamentTitle = values[0]
//           tournamentData.mtx = values[1]
//           tournamentData.tournamentDescription = values[2]
//           tournamentData.category = values[3]
//           tournamentData.totalRounds = values[4]
//           tournamentData.currentRound = values[5]
//           tournamentData.numberOfParticipants = values[6]
//           tournamentData.address = tournamentAddress
//           tournamentData.ipType = ''
//           tournamentData.tournamentId = ''
//           tournamentData.externalAddress = values[7]
//
//           responses.push(tournamentData)
//           if (responses.length == tournamentAddresses.length) {
//             return responses
//           }
//           console.log(values)
//         })
//       }
//     }
//   } catch (err) {
//     throw new Error(err)
//     console.log('message received from platform calls: ', err)
//   }
// }

module.exports = tournamentController
