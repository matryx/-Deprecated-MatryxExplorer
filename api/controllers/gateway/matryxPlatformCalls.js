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
        console.log(web3.fromWei(res.toString()))
        resolve(web3.fromWei(res.toString()))
      }
    })
  })
}

matryxPlatformCalls.getTournamentDescription = function (tournamentAddress) {
  console.log('>MatryxPlatformCalls: Retrieving Tournament Description at: ' + tournamentAddress)
  return new Promise((resolve, reject) => {
    tournamentContract = web3.eth.contract(tournamentAbi).at(tournamentAddress)
    tournamentContract.getExternalAddress((err, res) => {
      if (err) reject(err)
      else {
        _externalAddress = web3.toAscii(res)
        console.log('The external address of the tournament is: ' + _externalAddress)
        ipfsCalls.getIpfsDescriptionOnly(_externalAddress).then(function (_descriptionResponse) {
          console.log(_descriptionResponse)
          if (_descriptionResponse) {
            console.log('This should be the description itself: ' + res)
            resolve(_descriptionResponse)
          } else {
            resolve('Unable to retrieve description due to empty IPFS response')
          }
        })
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
        resolve(web3.fromWei(res.toString()))
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

matryxPlatformCalls.getAllRoundAddresses = function (tournamentAddress) {
  return new Promise((resolve, reject) => {
    tournamentContract = web3.eth.contract(tournamentAbi).at(tournamentAddress)
    let roundAddressList = []
    tournamentContract.maxRounds((err, totalRounds) => {
      if (err) reject(err)
      else {
        tournamentContract.currentRound((err, currentRoundResult) => {
          console.log(currentRoundResult[0].c[0])
          if (err) reject(err)
          else {
            for (i = 0; i < totalRounds; i++) {
              tournamentContract.rounds(i, (err, roundAddress) => {
                console.log('Round address = ' + roundAddress)
            // console.log(roundAddress == '0x')
                if (roundAddress != '0x') {
                  roundAddressList.push(roundAddress)
                }

                if (roundAddressList.length == currentRoundResult[0].c[0]) {
                  resolve(roundAddressList)
                }
              })
            }
          }
        })
      }
    })
  })
}

matryxPlatformCalls.getRoundAddressByIndex = function (tournamentAddress, roundIndex) {
  return new Promise((resolve, reject) => {
    tournamentContract = web3.eth.contract(tournamentAbi).at(tournamentAddress)
    tournamentContract.rounds(roundIndex, (err, roundAddress) => {
      console.log('Round address = ' + roundAddress)
            // console.log(roundAddress == '0x')
      if (roundAddress != '0x') {
        resolve(roundAddress)
      }
        // TODO: Throw error
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
        resolve(web3.fromWei(res.toString()))
      }
    })
  })
}

// TODO: does not work
matryxPlatformCalls.getRoundSubmissions = function (roundAddress) {
  return new Promise((resolve, reject) => {
    roundContract = web3.eth.contract(roundAbi).at(roundAddress)
    roundContract.getSubmissions((err, res) => {
      if (err) reject(err)
      else {
        console.log(res)
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

matryxPlatformCalls.roundStatus = function (roundAddress) {
  return new Promise((resolve, reject) => {
      // Logic for roundStatus
    roundContract = web3.eth.contract(roundAbi).at(roundAddress)
    roundContract.isOpen((err, isOpenResult) => {
      if (isOpenResult == true) {
        resolve('isOpen')
      } else {
        roundContract.isInReview((err, isInReviewResult) => {
          if (isInReviewResult == true) { resolve('inReview') } else {
            resolve('isClosed')
          }
        })
      }
    })
  })
}

matryxPlatformCalls.getSubmissionsFromRound = function (roundAddress) {
  return new Promise((resolve, reject) => {
    let fullResponse = {
      roundStatusValue: '',
      submissionResults: []
    }

    let submissionResults = []
    // Check to see if the round is closed or unavailable
    matryxPlatformCalls.roundStatus(roundAddress).then(function (roundStatusValue) {
      if (roundStatusValue == 'inReview') {
        console.log('>MatryxPlatformCalls: Round Status = ' + roundStatusValue)
        fullResponse.roundStatusValue = roundStatusValue
        resolve(fullResponse)
      }
      if (roundStatusValue == 'isOpen') {
        console.log('>MatryxPlatformCalls: Round Status = ' + roundStatusValue)
        console.log('Submission results are: ' + submissionResults)
        fullResponse.roundStatusValue = roundStatusValue
        resolve(fullResponse)
      } else if (roundStatusValue == 'isClosed') {
        console.log('>MatryxPlatformCalls: Round Status = ' + roundStatusValue)

        console.log('Retrieving all all submissionAddresses..')

        matryxPlatformCalls.getRoundSubmissions(roundAddress).then(function (submissionAddresses) {
          console.log(submissionAddresses)

    // Check number of submission
          submissionAddresses.forEach(function (submissionAddress) {
            let submission = {
              address: '',
              title: '',
              submissionDate: ''
            }

            submissionContract = web3.eth.contract(submissionAbi).at(submissionAddress)
            submissionContract.getTitle((err, _title) => {
              submission.address = submissionAddress
              submission.title = _title
              console.log('The following is the submission values: ')
              submissionContract.getTimeSubmitted((err, _timeSubmitted) => {
                submission.submissionDate = _timeSubmitted
                console.log(submission)

                submissionResults.push(submission)

                if (submissionResults.length == submissionAddresses.length) {
                  fullResponse.submissionResults = submissionResults
                  fullResponse.roundStatusValue = roundStatusValue
                  resolve(fullResponse)
                }
              })
            })
          })
        })
      }
    })
  })
}

matryxPlatformCalls.getSubmissionsFromRound2 = function (roundAddress) {
  return new Promise((resolve, reject) => {
    let submissionResults = []
    roundContract = web3.eth.contract(roundAbi).at(roundAddress)
    roundContract.getSubmissions((err, submissionAddresses) => {
      console.log('These are the submission Addresses: ' + submissionAddresses)
      submissionAddresses.forEach(function (submissionAddress) {
        let submission = {
          address: '',
          title: ''
        }

        submissionContract = web3.eth.contract(submissionAbi).at(submissionAddress)
        submissionContract.title((err, _title) => {
          submission.address = submissionAddress
          submission.title = _title
          submissionResults.push(submission)

          if (submissionResults.length == submissionAddresses.length) {
            resolve(submissionResults)
          }
        })
      })
    })
  })
}

matryxPlatformCalls.getTournamentInfoFromRoundAddress = function (_roundAddress) {
  console.log('>MatryxPlatformCalls: getTournamentInfoFromRoundAddress(' + _roundAddress + ')')
  return new Promise((resolve, reject) => {
    let tournamentInfo = {
      tournamentAddress: '',
      tournamentTitle: '',
      tournamentDescription: ''
    }
    // Get the parent Tournament address
    matryxPlatformCalls.getParentTournamentFromRound(_roundAddress).then(function (_tournamentAddress) {
      console.log('parentTournament is: ' + _tournamentAddress)
      tournamentInfo.tournamentAddress = _tournamentAddress
      matryxPlatformCalls.getTournamentTitle(_tournamentAddress).then(function (_tournamentTitle) {
        tournamentInfo.tournamentTitle = _tournamentTitle

        console.log('tournamentTitle is: ' + _tournamentTitle)

        matryxPlatformCalls.getTournamentDescription(_tournamentAddress).then(function (_tournamentDescription) {
          console.log('tournamentDescription is: ' + _tournamentDescription)
          tournamentInfo.tournamentDescription = _tournamentDescription
        // tournamentInfo.tournamentDescription = 'TODO fill in with valid description or err'

          console.log('tournamentInfoFromRoundAddress is: ' + tournamentInfo)
          resolve(tournamentInfo)
        })
      })
    })
  })
}

matryxPlatformCalls.getTournamentInfoFromRoundAddressNoIPFS = function (_roundAddress) {
  console.log('>MatryxPlatformCalls: getTournamentInfoFromRoundAddress(' + _roundAddress + ')')
  return new Promise((resolve, reject) => {
    let tournamentInfo = {
      tournamentAddress: '',
      tournamentTitle: '',
      tournamentDescription: ''
    }
    // Get the parent Tournament address
    matryxPlatformCalls.getParentTournamentFromRound(_roundAddress).then(function (_tournamentAddress) {
      console.log('parentTournament is: ' + _tournamentAddress)
      tournamentInfo.tournamentAddress = _tournamentAddress
      matryxPlatformCalls.getTournamentTitle(_tournamentAddress).then(function (_tournamentTitle) {
        tournamentInfo.tournamentTitle = _tournamentTitle

        console.log('tournamentTitle is: ' + _tournamentTitle)

        // matryxPlatformCalls.getTournamentDescription(_tournamentAddress).then(function (_tournamentDescription) {
          // console.log('tournamentDescription is: ' + _tournamentDescription)
          // tournamentInfo.tournamentDescription = _tournamentDescription
        tournamentInfo.tournamentDescription = 'TODO fill in with valid description or err'

        console.log('tournamentInfoFromRoundAddress is: ' + tournamentInfo)
        resolve(tournamentInfo)
        // })
      })
    })
  })
}

/*
* SUBMISSION
*/

matryxPlatformCalls.getSubmissionTitle = function (submissionAddress) {
  console.log('>MatryxPlatformCalls: Retrieving submission title from: ' + submissionAddress)

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
  console.log('>MatryxPlatformCalls: Retrieving submission author from: ' + submissionAddress)

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
  console.log('>MatryxPlatformCalls: Retrieving submission external address from: ' + submissionAddress)

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
  console.log('>MatryxPlatformCalls: Retrieving submission references from: ' + submissionAddress)

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
  console.log('>MatryxPlatformCalls: Retrieving submission contributors from: ' + submissionAddress)

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
  console.log('>MatryxPlatformCalls: Retrieving submission time submitted from: ' + submissionAddress)

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
  console.log('>MatryxPlatformCalls: Retrieving submission time updated from: ' + submissionAddress)
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
  console.log('>MatryxPlatformCalls: Retrieving submission balance from: ' + submissionAddress)

  return new Promise((resolve, reject) => {
    submissionContract = web3.eth.contract(submissionAbi).at(submissionAddress)
    console.log(submissionContract)
    submissionContract.getBalance((err, res) => {
      if (err) reject(err)
      else {
        resolve(res)
      }
    })
  })
}

matryxPlatformCalls.getRoundAddressFromSubmission = function (submissionAddress) {
  console.log('>MatryxPlatformCalls: Retrieving round address from submission: ' + submissionAddress)
  return new Promise((resolve, reject) => {
    submissionContract = web3.eth.contract(submissionAbi).at(submissionAddress)
    submissionContract.getRound((err, res) => {
      if (err) reject(err)
      else {
        resolve(res)
      }
    })
  })
}
matryxPlatformCalls.getTournamentAddressFromSubmission = function (submissionAddress) {
  console.log('>MatryxPlatformCalls: Retrieving tournament address from submission: ' + submissionAddress)

  return new Promise((resolve, reject) => {
    submissionContract = web3.eth.contract(submissionAbi).at(submissionAddress)
    submissionContract.getTournament((err, res) => {
      if (err) reject(err)
      else {
        resolve(res)
      }
    })
  })
}

matryxPlatformCalls.getSubmissionDescription = function (submissionAddress) {
  console.log('>MatryxPlatformCalls: Retrieving submission description from: ' + submissionAddress)

  return new Promise((resolve, reject) => {
    submissionContract = web3.eth.contract(submissionAbi).at(submissionAddress)
    submissionContract.getExternalAddress((err, res) => {
      if (err) reject(err)
      else {
        _externalAddress = web3.toAscii(res)
        ipfsCalls.getIpfsDescriptionOnly(_externalAddress).then(function (description) {
          resolve(description)
        })
      }
    })
  })
}

matryxPlatformCalls.getSubmissionContents = function (submissionAddress) {
  console.log('>MatryxPlatformCalls: Retrieving submission contents from: ' + submissionAddress)

  return new Promise((resolve, reject) => {
    submissionContract = web3.eth.contract(submissionAbi).at(submissionAddress)
    submissionContract.getExternalAddress((err, res) => {
      if (err) reject(err)
      else {
        _externalAddress = web3.toAscii(res)
        ipfsCalls.getIpfsDataFiles(_externalAddress).then(function (ipfsResults) {
          console.log(res)
          resolve(ipfsResults)
        })
          // Call IPFS with external address and return the description
      }
    })
  })
}

matryxPlatformCalls.getRoundInfoFromSubmission = function (submissionAddress) {
  console.log('>MatryxPlatformCalls: Retrieving Round info from submission: ' + submissionAddress)
  return new Promise((resolve, reject) => {
    matryxPlatformCalls.getRoundAddressFromSubmission(submissionAddress).then(function (roundAddress) {
      matryxPlatformCalls.getRoundBounty(roundAddress).then(function (mtx) {
        resolve(roundAddress, web3.fromWei(mtx.toString()))
      })
    })
  })
}

matryxPlatformCalls.getTournamentInfoFromSubmission = function (submissionAddress) {
  console.log('>MatryxPlatformCalls: Retrieving tournament info from submission: ' + submissionAddress)

  return new Promise((resolve, reject) => {
    matryxPlatformCalls.getTournamentAddressFromSubmission(submissionAddress).then(function (tournamentAddress) {
      matryxPlatformCalls.getTournamentTitle(tournamentAddress).then(function (title) {
        matryxPlatformCalls.currentRoundOfTournament(tournamentAddress).then(function (currentRound) {
          resolve(tournamentAddress, title, currentRound)
        })
      })
    })
  })
}

matryxPlatformCalls.getSubmissionParentInfo = function (submissionAddress) {
  console.log('>MatryxPlatformCalls: Retrieving parent info for submission: ' + submissionAddress)
  return new Promise((resolve, reject) => {
    let parentInfoItem = {
      currentRound: 0, // tournament
      roundAddress: '',
      roundMtx: 0,
      tournamentName: '', // tournament
      tournamentAddress: '' // tournament
    }
    let parentInfoCalls = []

    parentInfoCalls.push(matryxPlatformCalls.getRoundInfoFromSubmission(submissionAddress))
    parentInfoCalls.push(matryxPlatformCalls.getTournamentInfoFromSubmission(submissionAddress))

    Promise.all(parentInfoCalls).then(function (values) {
      console.log('parentInfoCalls = ' + values)
      parentInfoItem.currentRound = values[1][2]
      parentInfoItem.roundAddress = values[0][0]
      parentInfoItem.roundMtx = values[0][1]
      parentInfoItem.tournamentName = values[1][1]
      parentInfoItem.tournamentAddress = values[1][0]

      resolve(parentInfoItem)
    })

          // Call IPFS with external address and return the description
  })
}

/*
Activity
*/

matryxPlatformCalls.getPlatformActivity = function () {
  return new Promise((resolve, reject) => {
    let activityEvents = []

          // Make the Platform activity call
    matryxPlatformContract.allEvents({fromBlock: 0x0, toBlock: 'latest'}).get((err, events) => {
        // Dictionary for event types for switch case
      let eventDict = {
        TournamentCreated: 0,
        TournamentOpened: 1,
        UserEnteredTournament: 2

      }

      // events.forEach((event_i) => {
      for (i = 0; i < events.length; i++) {
        event_i = events[i]

        let activityResponse = {
          news: ''
        }
          // last event ->
        console.log(eventDict[event_i.event])
            // TODO Fix the switch case, it currently only spits out case 1 regardless of case. Could be break spacing due to linter.
        switch (eventDict[event_i.event]) {
          case 0:
            {
              activityResponse.news = event_i.args._owner + ' created a new Tournament named ' + '\'' + event_i.args._tournamentName + '\''
              break
            }
          case 1:
            {
              activityResponse.news = event_i.args._owner + ' opened their Tournament named ' + '\'' + event_i.args._tournamentName + '\''
              break
            }
          case 2:
            {
              activityResponse.news = event_i.args._entrant + ' entered the Tournament: ' + '\'' + event_i.args._tournamentAddress + '\''
              break
            }
          default:
            console.log('This event type does not match our records...Something bad happened...')
            activityResponse.news = ''
        }
        console.log('The activity response is: ' + activityResponse)
        activityEvents.push(activityResponse)
        if (activityEvents.length == events.length) {
          resolve(activityEvents)
        }
      }
      // console.log(activityEvents)
    })
  })
}

module.exports = matryxPlatformCalls
