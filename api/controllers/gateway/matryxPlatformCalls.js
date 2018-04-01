/*
The Matryx Platform Smart Contract interaction file

authors - sam@nanome.ai
Nanome 2018
*/

/*
Imports
*/

const version = process.env.PLATFORM_VERSION

const Web3 = require('web3')
const config = require('../../../config')
const externalApiCalls = require('./externalApiCalls')
const ipfsCalls = require('./ipfsCalls')

let web3Provider = process.env.CUSTOMRPC
let web3 = new Web3()
web3.setProvider(new web3.providers.HttpProvider(web3Provider)) // Elastic IP Address -> http://52.8.65.20:8545
console.log('Connected to: ' + web3Provider)

let matryxPlatformCalls = {}

let matryxPlatformAbi
let matryxPlatformAddress
let tournamentAbi
let submissionAbi
let roundAbi

externalApiCalls.getMatryxTournamentAbi(version).then(function (results) {
  tournamentAbi = results.abi
})
externalApiCalls.getMatryxRoundAbi(version).then(function (results) {
  roundAbi = results.abi
})
externalApiCalls.getMatryxSubmissionAbi(version).then(function (results) {
  submissionAbi = results.abi
})

externalApiCalls.getMatryxPlatformInfo(version).then(function (results) {
  matryxPlatformAddress = results['networks']['777']['address']
  matryxPlatformAbi = JSON.stringify(results.abi)
  matryxPlatformAbi = JSON.parse(matryxPlatformAbi)

  console.log('Current Matryx Platform Address in use: \'' + matryxPlatformAddress + '\'')
  matryxPlatformContract = web3.eth.contract(matryxPlatformAbi).at(matryxPlatformAddress)

  console.log('There are ' + matryxPlatformContract.tournamentCount().c[0] + ' tournaments on the Platform.')
})

/*
* PLATFORM
*/

matryxPlatformCalls.getTournamentCount = function () {
  return new Promise((resolve, reject) => {
    matryxPlatformContract.tournamentCount((err, res) => {
      if (err) reject(err)
      else {
        resolve(parseInt(res))
      }
    })
  })
}

matryxPlatformCalls.allTournaments = function (index) {
  return new Promise((resolve, reject) => {
    matryxPlatformContract.allTournaments(index, (err, res) => {
      if (err) reject(err)
      else {
        resolve(res)
      }
    })
  })
}

matryxPlatformCalls.allEvents = function (fromBlock, toBlock, param) {
  return new Promise((resolve, reject) => {
    matryxPlatformContract.allEvents({fromBlock: 0x0, toBlock: 'latest'}, (err, res) => {
      if (err) reject(err)
      else {
        res.get((err, events) => {
          resolve(events)
        })
      }
    })
  })
}

matryxPlatformCalls.getTournamentByCategory = function (category) {
  return new Promise((resolve, reject) => {
    matryxPlatformContract.getTournamentByCategory(category, (err, res) => {
      if (err) reject(err)
      else {
        resolve(res)
      }
    })
  })
}

matryxPlatformCalls.getCategoryCount = function (category) {
  return new Promise((resolve, reject) => {
    matryxPlatformContract.getCategoryCount(category, (err, res) => {
      if (err) reject(err)
      else {
        resolve(res)
      }
    })
  })
}

matryxPlatformCalls.getTopCategory = function (category) {
  return new Promise((resolve, reject) => {
    matryxPlatformContract.getCategoryCount(category, (err, res) => {
      if (err) reject(err)
      else {
        resolve(res)
      }
    })
  })
}

matryxPlatformCalls.isPeer = function (address) {
  return new Promise((resolve, reject) => {
    matryxPlatformContract.isPeer(address, (err, res) => {
      if (err) reject(err)
      else {
        resolve(res)
      }
    })
  })
}

matryxPlatformCalls.peerExistsAndOwnsSubmission = function (peerAddress, submissionAddress) {
  return new Promise((resolve, reject) => {
    matryxPlatformContract.peerExistsAndOwnsSubmission(peerAddress, submissionAddress, (err, res) => {
      if (err) reject(err)
      else {
        resolve(res)
      }
    })
  })
}

matryxPlatformCalls.isSubmission = function (submissionAddress) {
  return new Promise((resolve, reject) => {
    matryxPlatformContract.isSubmission(submissionAddress, (err, res) => {
      if (err) reject(err)
      else {
        resolve(res)
      }
    })
  })
}

matryxPlatformCalls.getTokenAddress = function () {
  return new Promise((resolve, reject) => {
    matryxPlatformContract.getTokenAddress((err, res) => {
      if (err) reject(err)
      else {
        resolve(res)
      }
    })
  })
}

matryxPlatformCalls.getTournamentAtIndex = function (index) {
  return new Promise((resolve, reject) => {
    matryxPlatformContract.getTournamentAtIndex(index, (err, res) => {
      if (err) reject(err)
      else {
        resolve(res)
      }
    })
  })
}

// TODO: redo this to put them in the same order everytime using a Dictionary
matryxPlatformCalls.getAllTournamentAddresses = function () {
  return new Promise((resolve, reject) => {
    let addressList = []
      // Get the number of tournaments from the platform
    matryxPlatformContract.tournamentCount((err, tournamentCount) => {
      for (i = 0; i < tournamentCount; i++) {
        // console.log(i)
        let j = i
        matryxPlatformContract.getTournamentAtIndex(j, (err, tournamentAddress) => {
          console.log('Tournament #: ' + j + ' is at address: ' + tournamentAddress)
          addressList.push(tournamentAddress)

          if (addressList.length == tournamentCount) {
            console.log('The addresses of the tournaments are: ' + addressList)
            console.log(addressList.length)
            resolve(addressList)
          }
        })
      }
    })
  })
}

/*
* TOURNAMENT
*/

matryxPlatformCalls.getTournamentTitle = function (tournamentAddress) {
  return new Promise((resolve, reject) => {
    tournamentContract = web3.eth.contract(tournamentAbi).at(tournamentAddress)
    tournamentContract.title((err, res) => {
      if (err) reject(err)
      else {
        resolve(res)
      }
    })
  })
}

matryxPlatformCalls.getTournamentOwner = function (tournamentAddress) {
  return new Promise((resolve, reject) => {
    tournamentContract = web3.eth.contract(tournamentAbi).at(tournamentAddress)
    tournamentContract.owner((err, res) => {
      if (err) reject(err)
      else {
        resolve(res)
      }
    })
  })
}

matryxPlatformCalls.getTournamentBounty = function (tournamentAddress) {
  return new Promise((resolve, reject) => {
    tournamentContract = web3.eth.contract(tournamentAbi).at(tournamentAddress)
    tournamentContract.Bounty((err, res) => {
      if (err) reject(err)
      else {
        resolve(parseInt(res.toString()))
      }
    })
  })
}

matryxPlatformCalls.getTournamentDescription = function (tournamentAddress) {
  return new Promise((resolve, reject) => {
    tournamentContract = web3.eth.contract(tournamentAbi).at(tournamentAddress)
    tournamentContract.getExternalAddress((err, res) => {
      if (err) reject(err)
      else {
        _descriptionResponse = web3.toAscii(res)
        ipfsCalls.getIpfsDescriptionOnly(_descriptionResponse, (err, res) => {
          if (err) reject(err)
          else {
            console.log(res)
            resolve(res)
          }
        })
          // Call IPFS with external address and return the description
      }
    })
  })
}

matryxPlatformCalls.getTournamentCategory = function (tournamentAddress) {
  return new Promise((resolve, reject) => {
    tournamentContract = web3.eth.contract(tournamentAbi).at(tournamentAddress)
    tournamentContract.category((err, res) => {
      if (err) reject(err)
      else {
        resolve(res)
      }
    })
  })
}

matryxPlatformCalls.getTournamentMaxRounds = function (tournamentAddress) {
  return new Promise((resolve, reject) => {
    tournamentContract = web3.eth.contract(tournamentAbi).at(tournamentAddress)
    tournamentContract.maxRounds((err, res) => {
      if (err) reject(err)
      else {
        resolve(parseInt(res.toString()))
      }
    })
  })
}

matryxPlatformCalls.isEntrantToTournament = function (tournamentAddress, userAddress) {
  return new Promise((resolve, reject) => {
    tournamentContract = web3.eth.contract(tournamentAbi).at(tournamentAddress)
    tournamentContract.isEntrant(userAddress, (err, res) => {
      if (err) reject(err)
      else {
        resolve(res)
      }
    })
  })
}

matryxPlatformCalls.isOpenTournament = function (tournamentAddress) {
  return new Promise((resolve, reject) => {
    tournamentContract = web3.eth.contract(tournamentAbi).at(tournamentAddress)
    tournamentContract.isEntrant((err, res) => {
      if (err) reject(err)
      else {
        resolve(res)
      }
    })
  })
}

matryxPlatformCalls.isInReviewTournament = function (tournamentAddress) {
  return new Promise((resolve, reject) => {
    tournamentContract = web3.eth.contract(tournamentAbi).at(tournamentAddress)
    tournamentContract.isInReview((err, res) => {
      if (err) reject(err)
      else {
        resolve(res)
      }
    })
  })
}

matryxPlatformCalls.roundIsOpenTournament = function (tournamentAddress) {
  return new Promise((resolve, reject) => {
    tournamentContract = web3.eth.contract(tournamentAbi).at(tournamentAddress)
    tournamentContract.roundIsOpen((err, res) => {
      if (err) reject(err)
      else {
        resolve(res)
      }
    })
  })
}

matryxPlatformCalls.getExternalAddressTournament = function (tournamentAddress) {
  return new Promise((resolve, reject) => {
    tournamentContract = web3.eth.contract(tournamentAbi).at(tournamentAddress)
    tournamentContract.getExternalAddress((err, res) => {
      if (err) reject(err)
      else {
        _externalAddress = web3.toAscii(res)
        resolve(_externalAddress)
      }
    })
  })
}

matryxPlatformCalls.currentRoundOfTournament = function (tournamentAddress) {
  return new Promise((resolve, reject) => {
    tournamentContract = web3.eth.contract(tournamentAbi).at(tournamentAddress)
    tournamentContract.currentRound((err, res) => {
      if (err) reject(err)
      else {
        resolve(parseInt(res.toString()))
      }
    })
  })
}
matryxPlatformCalls.currentRoundAddressOfTournament = function (tournamentAddress) {
  return new Promise((resolve, reject) => {
    tournamentContract = web3.eth.contract(tournamentAbi).at(tournamentAddress)
    tournamentContract.currentRound((err, res) => {
      if (err) reject(err)
      else {
        resolve(res[1])
      }
    })
  })
}

matryxPlatformCalls.submissionsCountOfTournament = function (tournamentAddress) {
  return new Promise((resolve, reject) => {
    tournamentContract = web3.eth.contract(tournamentAbi).at(tournamentAddress)
    tournamentContract.submissionCount((err, res) => {
      if (err) reject(err)
      else {
        resolve(res)
      }
    })
  })
}

matryxPlatformCalls.entrantCountOfTournament = function (tournamentAddress) {
  return new Promise((resolve, reject) => {
    tournamentContract = web3.eth.contract(tournamentAbi).at(tournamentAddress)
    tournamentContract.entrantCount((err, res) => {
      if (err) reject(err)
      else {
        resolve(parseInt(res.toString()))
      }
    })
  })
}

matryxPlatformCalls.getEntryFeeOfTournament = function (tournamentAddress) {
  return new Promise((resolve, reject) => {
    tournamentContract = web3.eth.contract(tournamentAbi).at(tournamentAddress)
    tournamentContract.getEntryFee((err, res) => {
      if (err) reject(err)
      else {
        resolve(res)
      }
    })
  })
}

matryxPlatformCalls.getCurrentRoundEndTimeFromTournament = function (tournamentAddress) {
  return new Promise((resolve, reject) => {
    tournamentContract = web3.eth.contract(tournamentAbi).at(tournamentAddress)
    // get the current round address
    tournamentContract.currentRound((err, res) => {
      if (err) reject(err)
      else {
        roundAddress = res[1]
        roundContract = web3.eth.contract(roundAbi).at(roundAddress)
        roundContract.endTime((err, res) => {
          if (err) reject(err)
          else {
            resolve(res)
          }
        })
      }
    })
  })
}

/*
* ROUND
*/
matryxPlatformCalls.isOpenRound = function (roundAddress) {
  return new Promise((resolve, reject) => {
    roundContract = web3.eth.contract(roundAbi).at(roundAddress)
    roundContract.isOpen((err, res) => {
      if (err) reject(err)
      else {
        resolve(res)
      }
    })
  })
}

matryxPlatformCalls.isInRoundReviewPeriod = function (roundAddress) {
  return new Promise((resolve, reject) => {
    roundContract = web3.eth.contract(roundAbi).at(roundAddress)
    roundContract.isInReview((err, res) => {
      if (err) reject(err)
      else {
        resolve(res)
      }
    })
  })
}

matryxPlatformCalls.getParentTournamentFromRound = function (roundAddress) {
  return new Promise((resolve, reject) => {
    roundContract = web3.eth.contract(roundAbi).at(roundAddress)
    roundContract.getTournament((err, res) => {
      if (err) reject(err)
      else {
        resolve(res)
      }
    })
  })
}

matryxPlatformCalls.getRoundBounty = function (roundAddress) {
  return new Promise((resolve, reject) => {
    roundContract = web3.eth.contract(roundAbi).at(roundAddress)
    roundContract.getBounty((err, res) => {
      if (err) reject(err)
      else {
        resolve(res)
      }
    })
  })
}

matryxPlatformCalls.getRoundSubmissions = function (roundAddress) {
  return new Promise((resolve, reject) => {
    roundContract = web3.eth.contract(roundAbi).at(roundAddress)
    roundContract.getSubmissions((err, res) => {
      if (err) reject(err)
      else {
        resolve(res)
      }
    })
  })
}

matryxPlatformCalls.getSubmissionAddressFromRound = function (roundAddress, submissionIndex) {
  return new Promise((resolve, reject) => {
    roundContract = web3.eth.contract(roundAbi).at(roundAddress)
    roundContract.getSubmissionAddress(submissionIndex, (err, res) => {
      if (err) reject(err)
      else {
        resolve(res)
      }
    })
  })
}

matryxPlatformCalls.getSubmissionAuthorFromRound = function (roundAddress, submissionAddress) {
  return new Promise((resolve, reject) => {
    roundContract = web3.eth.contract(roundAbi).at(roundAddress)
    roundContract.getSubmissionAuthor(submissionAddress, (err, res) => {
      if (err) reject(err)
      else {
        resolve(res)
      }
    })
  })
}

matryxPlatformCalls.getBalanceOfRound = function (roundAddress) {
  return new Promise((resolve, reject) => {
    roundContract = web3.eth.contract(roundAbi).at(roundAddress)
    roundContract.getBalance((err, res) => {
      if (err) reject(err)
      else {
        resolve(res)
      }
    })
  })
}

matryxPlatformCalls.isSubmissionChosen = function (roundAddress) {
  return new Promise((resolve, reject) => {
    roundContract = web3.eth.contract(roundAbi).at(roundAddress)
    roundContract.submissionChosen((err, res) => {
      if (err) reject(err)
      else {
        resolve(res)
      }
    })
  })
}

matryxPlatformCalls.getWinningSubmissionAddress = function (roundAddress) {
  return new Promise((resolve, reject) => {
    roundContract = web3.eth.contract(roundAbi).at(roundAddress)
    roundContract.getWinningSubmissionAddress((err, res) => {
      if (err) reject(err)
      else {
        resolve(res)
      }
    })
  })
}

matryxPlatformCalls.numberOfSubmissions = function (roundAddress) {
  return new Promise((resolve, reject) => {
    roundContract = web3.eth.contract(roundAbi).at(roundAddress)
    roundContract.numberOfSubmissions((err, res) => {
      if (err) reject(err)
      else {
        resolve(res)
      }
    })
  })
}

/*
* SUBMISSION
*/

matryxPlatformCalls.getSubmissionTitle = function (submissionAddress) {
  return new Promise((resolve, reject) => {
    submissionContract = web3.eth.contract(submissionAbi).at(submissionAddress)
    submissionContract.getTitle((err, res) => {
      if (err) reject(err)
      else {
        resolve(res)
      }
    })
  })
}

matryxPlatformCalls.getSubmissionAuthor = function (submissionAddress) {
  return new Promise((resolve, reject) => {
    submissionContract = web3.eth.contract(submissionAbi).at(submissionAddress)
    submissionContract.getAuthor((err, res) => {
      if (err) reject(err)
      else {
        resolve(res)
      }
    })
  })
}

matryxPlatformCalls.getSubmissionExternalAddress = function (submissionAddress) {
  return new Promise((resolve, reject) => {
    submissionContract = web3.eth.contract(submissionAbi).at(submissionAddress)
    submissionContract.getExternalAddress((err, res) => {
      if (err) reject(err)
      else {
        _externalAddress = web3.toAscii(res)

        resolve(_externalAddress)
      }
    })
  })
}

matryxPlatformCalls.getSubmissionReferences = function (submissionAddress) {
  return new Promise((resolve, reject) => {
    submissionContract = web3.eth.contract(submissionAbi).at(submissionAddress)
    submissionContract.getReferences((err, res) => {
      if (err) reject(err)
      else {
        resolve(res)
      }
    })
  })
}

matryxPlatformCalls.getSubmissionContributors = function (submissionAddress) {
  return new Promise((resolve, reject) => {
    submissionContract = web3.eth.contract(submissionAbi).at(submissionAddress)
    submissionContract.getContributors((err, res) => {
      if (err) reject(err)
      else {
        resolve(res)
      }
    })
  })
}

matryxPlatformCalls.getSubmissionTimeSubmitted = function (submissionAddress) {
  return new Promise((resolve, reject) => {
    submissionContract = web3.eth.contract(submissionAbi).at(submissionAddress)
    submissionContract.getTimeSubmitted((err, res) => {
      if (err) reject(err)
      else {
        resolve(res)
      }
    })
  })
}

matryxPlatformCalls.getSubmissionTimeUpdated = function (submissionAddress) {
  return new Promise((resolve, reject) => {
    submissionContract = web3.eth.contract(submissionAbi).at(submissionAddress)
    submissionContract.getTimeUpdated((err, res) => {
      if (err) reject(err)
      else {
        resolve(res)
      }
    })
  })
}

matryxPlatformCalls.getSubmissionBalance = function (submissionAddress) {
  return new Promise((resolve, reject) => {
    submissionContract = web3.eth.contract(submissionAbi).at(submissionAddress)
    submissionContract.getBalance((err, res) => {
      if (err) reject(err)
      else {
        resolve(res)
      }
    })
  })
}

matryxPlatformCalls.getSubmissionBalance = function (submissionAddress) {
  return new Promise((resolve, reject) => {
    submissionContract = web3.eth.contract(submissionAbi).at(submissionAddress)
    submissionContract.getBalance((err, res) => {
      if (err) reject(err)
      else {
        resolve(res)
      }
    })
  })
}

module.exports = matryxPlatformCalls
