/*
The Matryx Platform Smart Contract interaction file

authors - sam@nanome.ai
Nanome 2018
*/

/*
Imports
*/

// TODO: Fix the API to reflect new struct changes for max

const Web3 = require('web3')
const externalApiCalls = require('./externalApiCalls')
const ipfsCalls = require('./ipfsCalls')

const version = process.env.PLATFORM_VERSION
const web3Provider = process.env.CUSTOMRPC
const networkId = process.env.NETWORK_ID

const web3 = new Web3()
web3.setProvider(new web3.providers.HttpProvider(web3Provider)) // Elastic IP Address -> http://52.8.65.20:8545
console.log('Connected to: ' + web3Provider)

let matryxPlatformCalls = {}

let matryxPlatformAbi
let matryxPlatformAddress
let tournamentAbi
let submissionAbi
let roundAbi

function bytesToAscii(bytes) {
  return web3.toAscii('0x' + bytes.map(b => b.substr(2)).join('').replace(/(00)+$/, ''))
}

externalApiCalls
  .getMatryxTournamentAbi(version)
  .then(({ abi }) => tournamentAbi = abi)
  .catch(err => console.log('Unable to retrieve tournament Abi', err))

externalApiCalls
  .getMatryxRoundAbi(version)
  .then(({ abi }) => roundAbi = abi)
  .catch(err => console.log('Unable to retrieve tournament Abi', err))

externalApiCalls
  .getMatryxSubmissionAbi(version)
  .then(({ abi }) => submissionAbi = abi)
  .catch(err => console.log('Unable to retrieve tournament Abi', err))

externalApiCalls
  .getMatryxPlatformInfo(version)
  .then(result => {
    matryxPlatformAddress = result['networks'][networkId]['address']
    matryxPlatformAbi = result.abi
    matryxPlatformContract = web3.eth.contract(matryxPlatformAbi).at(matryxPlatformAddress)

    console.log('Current Matryx Platform Address in use: \'' + matryxPlatformAddress + '\'')
    console.log('There are ' + matryxPlatformContract.tournamentCount().c[0] + ' tournaments on the Platform.')
  })
  .catch(err => console.log('Unable to retrieve platform Abi', err))

/*
* PLATFORM
*/

matryxPlatformCalls.getTournamentCount = () => {
  return matryxPlatformContract.tournamentCount()
}

// TODO: Async + error handling
matryxPlatformCalls.allTournaments = index => {
  return matryxPlatformContract.allTournaments(index)
}

matryxPlatformCalls.getTournamentsByCategory = category => {
  return matryxPlatformContract.getTournamentsByCategory(category)
}

matryxPlatformCalls.getCategoryCount = category => {
  return matryxPlatformContract.getCategoryCount(category)
}

matryxPlatformCalls.isPeer = address => {
  return matryxPlatformContract.isPeer(address)
}

matryxPlatformCalls.peerExistsAndOwnsSubmission = (peerAddress, submissionAddress) => {
  return matryxPlatformContract.peerExistsAndOwnsSubmission(peerAddress, submissionAddress)
}

matryxPlatformCalls.getTokenAddress = () => {
  return matryxPlatformContract.getTokenAddress()
}

// TODO: Async + error handling
matryxPlatformCalls.getTournamentAtIndex = index => {
  return matryxPlatformContract.getTournamentAtIndex(index)
}

matryxPlatformCalls.getTopCategories = async () => {
  let categories = []
  for (i = 0; i < 10; i++) {
    let category = await matryxPlatformContract.getTopCategory(i)
    categories.push(category)
  }
  return categories
}

// TODO: redo this to put them in the same order everytime using a Dictionary
matryxPlatformCalls.getAllTournamentAddresses = async () => {
  let addresses = []
  let tournamentCount = await matryxPlatformContract.tournamentCount()
  for (i = 0; i < tournamentCount; i++) {
    let address = await matryxPlatformContract.getTournamentAtIndex(i)
    addresses.push(address)
  }
  return addresses
}

/*
* TOURNAMENT
*/

matryxPlatformCalls.getTournamentTitle = async tournamentAddress => {
  tournamentContract = web3.eth.contract(tournamentAbi).at(tournamentAddress)
  return bytesToAscii(await tournamentContract.getTitle())
}

matryxPlatformCalls.getTournamentOwner = async tournamentAddress => {
  tournamentContract = web3.eth.contract(tournamentAbi).at(tournamentAddress)
  return await tournamentContract.owner()
}

matryxPlatformCalls.getTournamentBounty = async (tournamentAddress) => {
  tournamentContract = web3.eth.contract(tournamentAbi).at(tournamentAddress)
  let bounty = await tournamentContract.Bounty()
  return web3.fromWei(bounty.toString())
}

matryxPlatformCalls.getTournamentDescription = async (tournamentAddress) => {
  console.log('>MatryxPlatformCalls: Retrieving Tournament Description at: ' + tournamentAddress)

  tournamentContract = web3.eth.contract(tournamentAbi).at(tournamentAddress)
  let hash = await tournamentContract.getDescriptionHash()
  let externalAddress = bytesToAscii(hash)

  let description = await ipfsCalls.getIpfsDescriptionOnly(externalAddress)
  if (description) {
    return description
  } else {
    throw new Error('Unable to retrieve description due to empty IPFS response')
  }
}

matryxPlatformCalls.getTournamentCategory = async (tournamentAddress) => {
  tournamentContract = web3.eth.contract(tournamentAbi).at(tournamentAddress)
  return await tournamentContract.getCategory()
}

matryxPlatformCalls.getTournamentMaxRounds = async (tournamentAddress) => {
  tournamentContract = web3.eth.contract(tournamentAbi).at(tournamentAddress)
  let maxRounds = await tournamentContract.maxRounds()
  return parseInt(maxRounds.toString())
}

matryxPlatformCalls.isEntrantToTournament = async (tournamentAddress, userAddress) => {
  tournamentContract = web3.eth.contract(tournamentAbi).at(tournamentAddress)
  return await tournamentContract.isEntrant(userAddress)
}

// TODO not used
matryxPlatformCalls.isInReviewTournament = async (tournamentAddress) => {
  tournamentContract = web3.eth.contract(tournamentAbi).at(tournamentAddress)
  return await tournamentContract.isInReview()
}

// TODO not used
matryxPlatformCalls.roundIsOpenTournament = async (tournamentAddress) => {
  tournamentContract = web3.eth.contract(tournamentAbi).at(tournamentAddress)
  return await tournamentContract.roundIsOpen()
}

matryxPlatformCalls.getExternalAddressTournament = async (tournamentAddress) => {
  tournamentContract = web3.eth.contract(tournamentAbi).at(tournamentAddress)
  let hash = await tournamentContract.getDescriptionHash()
  return bytesToAscii(hash)
}

matryxPlatformCalls.currentRoundOfTournament = async (tournamentAddress) => {
  tournamentContract = web3.eth.contract(tournamentAbi).at(tournamentAddress)
  let currentRound = await tournamentContract.currentRound()
  return +currentRound[0]
}

matryxPlatformCalls.currentRoundAddressOfTournament = async (tournamentAddress) => {
  tournamentContract = web3.eth.contract(tournamentAbi).at(tournamentAddress)
  let currentRound = await tournamentContract.currentRound()
  return currentRound[1]
}

matryxPlatformCalls.submissionsCountOfTournament = async (tournamentAddress) => {
  tournamentContract = web3.eth.contract(tournamentAbi).at(tournamentAddress)
  return await tournamentContract.submissionCount()
}

matryxPlatformCalls.entrantCountOfTournament = async (tournamentAddress) => {
  tournamentContract = web3.eth.contract(tournamentAbi).at(tournamentAddress)
  let count = await tournamentContract.entrantCount()
  return +count
}

matryxPlatformCalls.getEntryFeeOfTournament = async (tournamentAddress) => {
  tournamentContract = web3.eth.contract(tournamentAbi).at(tournamentAddress)
  let fee = await tournamentContract.getEntryFee()
  return web3.fromWei(fee.toString())
}

matryxPlatformCalls.getCurrentRoundEndTimeFromTournament = async (tournamentAddress) => {
  tournamentContract = web3.eth.contract(tournamentAbi).at(tournamentAddress)
  let currentRound = await tournamentContract.currentRound()
  let roundAddress = currentRound[1]
  if (roundAddress == '0x') {
    throw new Error("The round address is invalid - '0x'")
  }
  let roundContract = web3.eth.contract(roundAbi).at(roundAddress)
  return await roundContract.endTime()
}

matryxPlatformCalls.getAllRoundAddresses = async (tournamentAddress) => {
  tournamentContract = web3.eth.contract(tournamentAbi).at(tournamentAddress)
  let addresses = []
  let currentRound = await tournamentContract.currentRound()
  let count = +currentRound[0]

  for (i = 0; i < count; i++) {
    let roundAddress = tournamentContract.rounds(i)
    if (roundAddress != '0x') {
      addresses.push(roundAddress)
    }
  }
  return addresses
}

matryxPlatformCalls.getRoundAddressByIndex = async (tournamentAddress, roundIndex) => {
  tournamentContract = web3.eth.contract(tournamentAbi).at(tournamentAddress)
  let roundAddress = await tournamentContract.rounds(roundIndex)
  if (roundAddress != '0x') {
    return roundAddress
  } else {
    throw new Error('round address is 0x')
  }
}

matryxPlatformCalls.isTournamentCreator = async (tournamentAddress, userAddress) => {
  tournamentContract = web3.eth.contract(tournamentAbi).at(tournamentAddress)
  let ownerAddress = await tournamentContract.owner()
  return ownerAddress == userAddress
}

/*
* ROUND
*/
matryxPlatformCalls.isOpenRound = async (roundAddress) => {
  roundContract = web3.eth.contract(roundAbi).at(roundAddress)
  let state = await roundContract.getState()
  return state === 1
}

matryxPlatformCalls.isInRoundReviewPeriod = async (roundAddress) => {
  roundContract = web3.eth.contract(roundAbi).at(roundAddress)
  return await roundContract.isInReview()
}

matryxPlatformCalls.getParentTournamentFromRound = async (roundAddress) => {
  roundContract = web3.eth.contract(roundAbi).at(roundAddress)
  return await roundContract.getTournament()
}

matryxPlatformCalls.getRoundBounty = async (roundAddress) => {
  roundContract = web3.eth.contract(roundAbi).at(roundAddress)
  let bounty = await roundContract.getBounty()
  return web3.fromWei(bounty.toString())
}

matryxPlatformCalls.getRoundSubmissions = async (roundAddress) => {
  roundContract = web3.eth.contract(roundAbi).at(roundAddress)
  return await roundContract.getSubmissions()
}

matryxPlatformCalls.getSubmissionAddressFromRound = async (roundAddress, submissionIndex) => {
  roundContract = web3.eth.contract(roundAbi).at(roundAddress)
  return await roundContract.getSubmissionAddress(submissionIndex)
}

matryxPlatformCalls.getSubmissionAuthorFromRound = async (roundAddress, submissionAddress) => {
  roundContract = web3.eth.contract(roundAbi).at(roundAddress)
  return await roundContract.getSubmissionAuthor(submissionAddress)
}

matryxPlatformCalls.getBalanceOfRound = async (roundAddress) => {
  roundContract = web3.eth.contract(roundAbi).at(roundAddress)
  return await roundContract.getBalance()
}

matryxPlatformCalls.isSubmissionChosen = async (roundAddress) => {
  roundContract = web3.eth.contract(roundAbi).at(roundAddress)
  return await roundContract.submissionChosen()
}

matryxPlatformCalls.getWinningSubmissionAddress = async (roundAddress) => {
  roundContract = web3.eth.contract(roundAbi).at(roundAddress)
  return await roundContract.getWinningSubmissionAddress()
}

matryxPlatformCalls.numberOfSubmissions = async (roundAddress) => {
  roundContract = web3.eth.contract(roundAbi).at(roundAddress)
  return await roundContract.numberOfSubmissions()
}

matryxPlatformCalls.roundStatus = async (roundAddress) => {
  roundContract = web3.eth.contract(roundAbi).at(roundAddress)
  let state = await roundContract.getState()
  if (state == 0) return 'isWaiting'
  else if (state == 1) return 'isOpen'
  else if (state == 2) return 'inReview'
  else if (state == 3) return 'isClosed'
  else if (state == 4) return 'isAbandoned'
}

// matryxPlatformCalls.getSubmissionsFromRound = async (roundAddress) => {
//   let fullResponse = {
//     roundStatusValue: '',
//     submissionResults: []
//   }

//   let submissionResults = []

//   let status = await matryxPlatformCalls.roundStatus(roundAddress)
//   fullResponse.roundStatusValue = status
//   console.log('>MatryxPlatformCalls: Round Status = ' + status)

//   if (status == 'isWaiting' || status == 'inReview' || status == 'isOpen') return fullResponse

//   if (status == 'isClosed' || status == "isAbandoned") {
//     console.log('Retrieving all all submissionAddresses..')

//     let addresses = await matryxPlatformCalls.getRoundSubmissions(roundAddress)
//     let submissionPromises = addresses.map(address => {
//       let promise = (async () => {
//         submissionContract = web3.eth.contract(submissionAbi).at(address)
//         let [title, submissionDate] = await Promise.all([
//           submissionContract.getTitle(),
//           submissionContract.getTimeSubmitted()
//         ])
//         return { title, address, submissionDate }
//       })()
//       return promise
//     })

//     fullResponse.submissionResults = await Promise.all(submissionPromises)
//     return fullResponse
//   }
// }

// TODO: Async + error handling
matryxPlatformCalls.getSubmissionsFromRound = (roundAddress) => {
  return new Promise((resolve, reject) => {
    let fullResponse = {
      roundStatusValue: '',
      submissionResults: []
    }

    let submissionResults = []
    // Check to see if the round is closed or unavailable
    matryxPlatformCalls.roundStatus(roundAddress).then((roundStatusValue) => {
      fullResponse.roundStatusValue = roundStatusValue
      if (roundStatusValue == 'inReview') {
        console.log('>MatryxPlatformCalls: Round Status = ' + roundStatusValue)
        resolve(fullResponse)
      }
      if (roundStatusValue == 'isOpen') {
        console.log('>MatryxPlatformCalls: Round Status = ' + roundStatusValue)
        console.log('Submission results are: ' + submissionResults)
        resolve(fullResponse)
      } else if (roundStatusValue == 'isClosed' || roundStatusValue == "isAbandoned") {
        console.log('>MatryxPlatformCalls: Round Status = ' + roundStatusValue)
        console.log('Retrieving all all submissionAddresses..')
        fullResponse.roundStatusValue = roundStatusValue

        matryxPlatformCalls.getRoundSubmissions(roundAddress).then((submissionAddresses) => {
          // console.log(submissionAddresses)

          if (submissionAddresses.length === 0) {
            fullResponse.submissionResults = []
            resolve(fullResponse)
          }

    // Check number of submission
          submissionAddresses.forEach((submissionAddress) => {
            let submission = {
              address: '',
              title: '',
              submissionDate: ''
            }

            submissionContract = web3.eth.contract(submissionAbi).at(submissionAddress)
            submissionContract.getTitle((err, _title) => {
              if (err) {
                reject(err)
              }
              submission.address = submissionAddress
              submission.title = _title
              console.log('The following is the submission values: ')
              submissionContract.getTimeSubmitted((err, _timeSubmitted) => {
                if (err) {
                  reject(err)
                }
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
        }).catch((err) => {
          reject(err)
        })
      }
    }).catch((err) => {
      reject(err)
    })
  })
}

matryxPlatformCalls.getTournamentInfoFromRoundAddress = async (roundAddress) => {
  console.log('>MatryxPlatformCalls: getTournamentInfoFromRoundAddress(' + roundAddress + ')')

  let tournamentAddress = await matryxPlatformCalls.getParentTournamentFromRound(roundAddress)
  let [tournamentTitle, tournamentDescription] = await Promise.all([
    matryxPlatformCalls.getTournamentTitle(tournamentAddress),
    matryxPlatformCalls.getTournamentDescription(tournamentAddress)
  ])
  return { tournamentTitle, tournamentDescription, tournamentAddress }
}

matryxPlatformCalls.getTournamentInfoFromRoundAddressNoIPFS = async (roundAddress) => {
  console.log('>MatryxPlatformCalls: getTournamentInfoFromRoundAddress(' + roundAddress + ')')

  let tournamentAddress = await matryxPlatformCalls.getParentTournamentFromRound(roundAddress)
  let tournamentTitle = await matryxPlatformCalls.getTournamentTitle(tournamentAddress)
  let tournamentDescription = 'TODO fill in with valid description or err'
  return { tournamentTitle, tournamentDescription, tournamentAddress }
}

/*
* SUBMISSION
*/

matryxPlatformCalls.getSubmissionTitle = async (submissionAddress) => {
  console.log('>MatryxPlatformCalls: Retrieving submission title from: ' + submissionAddress)

  submissionContract = web3.eth.contract(submissionAbi).at(submissionAddress)
  return await submissionContract.getTitle()
}

matryxPlatformCalls.getSubmissionAuthor = async (submissionAddress) => {
  console.log('>MatryxPlatformCalls: Retrieving submission author from: ' + submissionAddress)

  submissionContract = web3.eth.contract(submissionAbi).at(submissionAddress)
  return await submissionContract.getAuthor()
}

matryxPlatformCalls.getSubmissionExternalAddress = async (submissionAddress) => {
  console.log('>MatryxPlatformCalls: Retrieving submission external address from: ' + submissionAddress)

  submissionContract = web3.eth.contract(submissionAbi).at(submissionAddress)
  let externalAddress = await submissionContract.getExternalAddress()
  return web3.toAscii(externalAddress)
}

matryxPlatformCalls.getSubmissionReferences = async (submissionAddress) => {
  console.log('>MatryxPlatformCalls: Retrieving submission references from: ' + submissionAddress)

  submissionContract = web3.eth.contract(submissionAbi).at(submissionAddress)
  return await submissionContract.getReferences()
}

matryxPlatformCalls.getSubmissionContributors = async (submissionAddress) => {
  console.log('>MatryxPlatformCalls: Retrieving submission contributors from: ' + submissionAddress)

  submissionContract = web3.eth.contract(submissionAbi).at(submissionAddress)
  return await submissionContract.getContributors()
}

matryxPlatformCalls.getSubmissionTimeSubmitted = async (submissionAddress) => {
  console.log('>MatryxPlatformCalls: Retrieving submission time submitted from: ' + submissionAddress)

  submissionContract = web3.eth.contract(submissionAbi).at(submissionAddress)
  return await submissionContract.getTimeSubmitted()
}

matryxPlatformCalls.getSubmissionTimeUpdated = async (submissionAddress) => {
  console.log('>MatryxPlatformCalls: Retrieving submission time updated from: ' + submissionAddress)

  submissionContract = web3.eth.contract(submissionAbi).at(submissionAddress)
  return await submissionContract.getTimeUpdated()
}

matryxPlatformCalls.getSubmissionBalance = async (submissionAddress) => {
  console.log('>MatryxPlatformCalls: Retrieving submission balance from: ' + submissionAddress)

  submissionContract = web3.eth.contract(submissionAbi).at(submissionAddress)
  return await submissionContract.getBalance()
}

matryxPlatformCalls.getRoundAddressFromSubmission = async (submissionAddress) => {
  console.log('>MatryxPlatformCalls: Retrieving round address from submission: ' + submissionAddress)

  submissionContract = web3.eth.contract(submissionAbi).at(submissionAddress)
  return await submissionContract.getRound()
}

matryxPlatformCalls.getTournamentAddressFromSubmission = async (submissionAddress) => {
  console.log('>MatryxPlatformCalls: Retrieving tournament address from submission: ' + submissionAddress)

  submissionContract = web3.eth.contract(submissionAbi).at(submissionAddress)
  return await submissionContract.getTournament()
}

matryxPlatformCalls.getSubmissionDescription = async (submissionAddress) => {
  console.log('>MatryxPlatformCalls: Retrieving submission description from: ' + submissionAddress)

  submissionContract = web3.eth.contract(submissionAbi).at(submissionAddress)
  let externalAddress = await submissionContract.getExternalAddress()
  externalAddress = web3.toAscii(externalAddress)
  return await ipfsCalls.getIpfsDescriptionOnly(externalAddress)
}

matryxPlatformCalls.getSubmissionContents = async (submissionAddress) => {
  console.log('>MatryxPlatformCalls: Retrieving submission contents from: ' + submissionAddress)

  submissionContract = web3.eth.contract(submissionAbi).at(submissionAddress)
  let externalAddress = await submissionContract.getExternalAddress()
  web3.toAscii(externalAddress)
  return await ipfsCalls.getIpfsDataFiles(externalAddress)
}

matryxPlatformCalls.getRoundInfoFromSubmission = async (submissionAddress) => {
  console.log('>MatryxPlatformCalls: Retrieving Round info from submission: ' + submissionAddress)

  let roundAddress = await matryxPlatformCalls.getRoundAddressFromSubmission(submissionAddress)
  let bounty = await matryxPlatformCalls.getRoundBounty(roundAddress)
  return web3.fromWei(bounty.toString())
}

matryxPlatformCalls.getTournamentInfoFromSubmission = async (submissionAddress) => {
  console.log('>MatryxPlatformCalls: Retrieving tournament info from submission: ' + submissionAddress)

  let tournamentAddress = await matryxPlatformCalls.getTournamentAddressFromSubmission(submissionAddress)
  let [title, currentRound] = await Promise.all([
    matryxPlatformCalls.getTournamentTitle(tournamentAddress),
    matryxPlatformCalls.currentRoundOfTournament(tournamentAddress)
  ])
  return [tournamentAddress, title, currentRound]
}

matryxPlatformCalls.getSubmissionParentInfo = async (submissionAddress) => {
  console.log('>MatryxPlatformCalls: Retrieving parent info for submission: ' + submissionAddress)

  let [tournamentInfo, roundInfo] = await Promise.all([
    matryxPlatformCalls.getTournamentInfoFromSubmission(submissionAddress),
    matryxPlatformCalls.getRoundInfoFromSubmission(submissionAddress),
  ])
  let [tournamentAddress, tournamentName, currentRound] = tournamentInfo
  let [roundAddress, roundMtx] = roundInfo

  return {
    tournamentName,
    tournamentAddress,
    currentRound,
    roundAddress,
    roundMtx
  }

  // TODO Call IPFS with external address and return the description
}

matryxPlatformCalls.isSubmissionCreator = async (submissionAddress, userAddress) => {
  submissionContract = web3.eth.contract(submissionAbi).at(submissionAddress)
  let ownerAddress = await submissionContract.owner()
  return ownerAddress == userAddress
}

/*
Activity
*/

matryxPlatformCalls.getPlatformActivity = function () {
  return new Promise((resolve, reject) => {
    let activityEvents = []

    // Make the Platform activity call
    matryxPlatformContract.allEvents({ fromBlock: 0x0, toBlock: 'latest' }).get((err, events) => {
      if (err) {
        reject(err)
      }
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

        // console.log(eventDict[event_i.event])
        switch (eventDict[event_i.event]) {
          case 0:
            activityResponse.news = event_i.args._owner + ' created a new Tournament named ' + '\'' + event_i.args._tournamentName + '\''
            break
          case 1:
            activityResponse.news = event_i.args._owner + ' opened their Tournament named ' + '\'' + event_i.args._tournamentName + '\''
            break
          case 2:
            activityResponse.news = event_i.args._entrant + ' entered the Tournament: ' + '\'' + event_i.args._tournamentAddress + '\''
            break
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

// Experimental
//
// // TODO: Async + error handling
// matryxPlatformCalls.allEvents = (fromBlock = 0x0, toBlock = 'latest') => {
//   return new Promise((resolve, reject) => {
//     matryxPlatformContract.allEvents({ fromBlock, toBlock }, (err, res) => {
//       if (err) reject(err)
//       else {
//         res.get((err, events) => {
//           resolve(events)
//         })
//       }
//     })
//   })
// }

module.exports = matryxPlatformCalls
