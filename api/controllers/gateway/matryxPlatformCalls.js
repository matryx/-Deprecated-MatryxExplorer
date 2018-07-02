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
const { promisify } = require('../../helpers/responseHelpers')

const version = process.env.PLATFORM_VERSION
const web3Provider = process.env.CUSTOMRPC
const networkId = process.env.NETWORK_ID

const web3 = new Web3()
web3.setProvider(new web3.providers.HttpProvider(web3Provider)) // Elastic IP Address -> http://52.8.65.20:8545
console.log('Connected to: ' + web3Provider)

let matryxPlatformCalls = {}

let matryxPlatformAbi
let matryxPlatformAddress
let matryxPlatformContract

let matryxTokenAbi
let matryxTokenAddress
let matryxTokenContract

let tournamentAbi
let submissionAbi
let roundAbi

function bytesToAscii(bytes) {
  return web3.toAscii('0x' + bytes.map(b => b.substr(2)).join('').replace(/(00)+$/, ''))
}

externalApiCalls
  .getMatryxTournamentAbi(version)
  .then(({ abi }) => tournamentAbi = abi)
  .catch(err => console.log('Unable to retrieve Tournament ABI', err))

externalApiCalls
  .getMatryxRoundAbi(version)
  .then(({ abi }) => roundAbi = abi)
  .catch(err => console.log('Unable to retrieve Round ABI', err))

externalApiCalls
  .getMatryxSubmissionAbi(version)
  .then(({ abi }) => submissionAbi = abi)
  .catch(err => console.log('Unable to retrieve Submission ABI', err))

externalApiCalls
  .getMatryxPlatformInfo(version)
  .then(result => {
    matryxPlatformAddress = result['networks'][networkId]['address']
    matryxPlatformAbi = result.abi
    matryxPlatformContract = web3.eth.contract(matryxPlatformAbi).at(matryxPlatformAddress)

    console.log('Current Matryx Platform Address in use: \'' + matryxPlatformAddress + '\'')
    console.log('There are ' + matryxPlatformContract.tournamentCount().c[0] + ' tournaments on the Platform.')
  })
  .catch(err => console.log('Unable to retrieve Platform ABI', err))

externalApiCalls
  .getMatryxTokenInfo(version)
  .then(result => {
    matryxTokenAddress = result['networks'][networkId]['address']
    matryxTokenAbi = result.abi
    matryxTokenContract = web3.eth.contract(matryxTokenAbi).at(matryxTokenAddress)
  })
  .catch(err => console.log('Unable to retrieve Token ABI'))

/*
* PLATFORM
*/

matryxPlatformCalls.getTournamentCount = async () => {
  let count = await promisify(matryxPlatformContract.tournamentCount)()
  return +count
}

// TODO: Async + error handling
matryxPlatformCalls.allTournaments = index => {
  return promisify(matryxPlatformContract.allTournaments)(index)
}

matryxPlatformCalls.getTournamentsByCategory = category => {
  return promisify(matryxPlatformContract.getTournamentsByCategory)(category)
}

matryxPlatformCalls.getCategoryCount = async (category) => {
  let count = await promisify(matryxPlatformContract.getCategoryCount)(category)
  return +count
}

matryxPlatformCalls.isPeer = address => {
  return promisify(matryxPlatformContract.isPeer)(address)
}

matryxPlatformCalls.peerExistsAndOwnsSubmission = (peerAddress, submissionAddress) => {
  return promisify(matryxPlatformContract.peerExistsAndOwnsSubmission)(peerAddress, submissionAddress)
}

matryxPlatformCalls.getTokenAddress = () => {
  return promisify(matryxPlatformContract.getTokenAddress)()
}

// TODO: Async + error handling
matryxPlatformCalls.getTournamentAtIndex = index => {
  return promisify(matryxPlatformContract.getTournamentAtIndex)(index)
}

matryxPlatformCalls.getTopCategories = async () => {
  let categories = []
  for (i = 0; i < 10; i++) {
    let category = promisify(matryxPlatformContract.getTopCategory)(i)
    categories.push(category)
  }
  return await Promise.all(categories)
}

matryxPlatformCalls.getAllTournamentAddresses = async () => {
  let tournamentCount = await promisify(matryxPlatformContract.tournamentCount)()
  let promises = []
  for (let i = 0; i < tournamentCount; i++) {
    let promise = promisify(matryxPlatformContract.getTournamentAtIndex)(i)
    promises.push(promise)
  }
  return await Promise.all(promises)
}

/*
* TOURNAMENT
*/

matryxPlatformCalls.getTournamentTitle = async tournamentAddress => {
  let tournamentContract = web3.eth.contract(tournamentAbi).at(tournamentAddress)
  return bytesToAscii(await promisify(tournamentContract.getTitle)())
}

matryxPlatformCalls.getTournamentOwner = tournamentAddress => {
  let tournamentContract = web3.eth.contract(tournamentAbi).at(tournamentAddress)
  return promisify(tournamentContract.owner)()
}

matryxPlatformCalls.getTournamentBounty = async (tournamentAddress) => {
  let tournamentContract = web3.eth.contract(tournamentAbi).at(tournamentAddress)
  let bounty = await promisify(tournamentContract.bounty)()
  return +web3.fromWei(bounty.toString())
}

matryxPlatformCalls.getTournamentRemainingMtx = async (tournamentAddress) => {
  let mtx = await promisify(matryxTokenContract.balanceOf)(tournamentAddress)
  return +web3.fromWei(mtx.toString())
}

matryxPlatformCalls.getTournamentDescription = async (tournamentAddress) => {
  let hash = await matryxPlatformCalls.getDescriptionHashTournament(tournamentAddress)
  let description = await ipfsCalls.getIpfsFile(hash)
  if (description) {
    return description
  } else {
    throw new Error('Unable to retrieve description due to empty IPFS response')
  }
}

matryxPlatformCalls.getTournamentCategory = (tournamentAddress) => {
  let tournamentContract = web3.eth.contract(tournamentAbi).at(tournamentAddress)
  return promisify(tournamentContract.getCategory)()
}

// TODO not used
matryxPlatformCalls.getTournamentMaxRounds = async (tournamentAddress) => {
  let tournamentContract = web3.eth.contract(tournamentAbi).at(tournamentAddress)
  let maxRounds = await promisify(tournamentContract.maxRounds)()
  return parseInt(maxRounds.toString())
}

matryxPlatformCalls.isEntrantToTournament = (tournamentAddress, userAddress) => {
  let tournamentContract = web3.eth.contract(tournamentAbi).at(tournamentAddress)
  return promisify(tournamentContract.isEntrant)(userAddress)
}

// TODO not used
matryxPlatformCalls.isInReviewTournament = (tournamentAddress) => {
  let tournamentContract = web3.eth.contract(tournamentAbi).at(tournamentAddress)
  return promisify(tournamentContract.isInReview)()
}

// TODO not used
matryxPlatformCalls.roundIsOpenTournament = (tournamentAddress) => {
  let tournamentContract = web3.eth.contract(tournamentAbi).at(tournamentAddress)
  return promisify(tournamentContract.roundIsOpen)()
}

matryxPlatformCalls.getDescriptionHashTournament = async (tournamentAddress) => {
  let tournamentContract = web3.eth.contract(tournamentAbi).at(tournamentAddress)
  let hash = await promisify(tournamentContract.getDescriptionHash)()
  return bytesToAscii(hash)
}

matryxPlatformCalls.getFileHashTournament = async (tournamentAddress) => {
  let tournamentContract = web3.eth.contract(tournamentAbi).at(tournamentAddress)
  let hash = await promisify(tournamentContract.getFileHash)()
  return bytesToAscii(hash)
}

matryxPlatformCalls.currentRoundOfTournament = async (tournamentAddress) => {
  let tournamentContract = web3.eth.contract(tournamentAbi).at(tournamentAddress)
  let currentRound = await promisify(tournamentContract.currentRound)()
  return +currentRound[0]
}

matryxPlatformCalls.currentRoundAddressOfTournament = async (tournamentAddress) => {
  let tournamentContract = web3.eth.contract(tournamentAbi).at(tournamentAddress)
  let currentRound = await promisify(tournamentContract.currentRound)()
  return currentRound[1]
}

matryxPlatformCalls.submissionsCountOfTournament = async (tournamentAddress) => {
  let tournamentContract = web3.eth.contract(tournamentAbi).at(tournamentAddress)
  let count = await promisify(tournamentContract.submissionCount)()
  return +count
}

matryxPlatformCalls.entrantCountOfTournament = async (tournamentAddress) => {
  let tournamentContract = web3.eth.contract(tournamentAbi).at(tournamentAddress)
  let count = await promisify(tournamentContract.entrantCount)()
  return +count
}

matryxPlatformCalls.getEntryFeeOfTournament = async (tournamentAddress) => {
  let tournamentContract = web3.eth.contract(tournamentAbi).at(tournamentAddress)
  let fee = await promisify(tournamentContract.getEntryFee)()
  return +web3.fromWei(fee.toString())
}

matryxPlatformCalls.getCurrentRoundEndTimeFromTournament = async (tournamentAddress) => {
  let tournamentContract = web3.eth.contract(tournamentAbi).at(tournamentAddress)
  let currentRound = await promisify(tournamentContract.currentRound)()
  let roundAddress = currentRound[1]
  if (roundAddress == '0x') {
    throw new Error("The round address is invalid - '0x'")
  }
  let roundContract = web3.eth.contract(roundAbi).at(roundAddress)
  let endTime = await promisify(roundContract.getEndTime)()
  return +endTime
}

matryxPlatformCalls.getAllRoundAddresses = async (tournamentAddress) => {
  let tournamentContract = web3.eth.contract(tournamentAbi).at(tournamentAddress)
  let addresses = []
  let currentRound = await promisify(tournamentContract.currentRound)()
  let count = +currentRound[0]

  for (i = 0; i < count; i++) {
    let roundAddress = await promisify(tournamentContract.rounds)(i)
    if (roundAddress != '0x') {
      addresses.push(roundAddress)
    }
  }
  return addresses
}

matryxPlatformCalls.getRoundAddressByIndex = async (tournamentAddress, roundIndex) => {
  let tournamentContract = web3.eth.contract(tournamentAbi).at(tournamentAddress)
  let roundAddress = await promisify(tournamentContract.rounds)(roundIndex)
  if (roundAddress != '0x') {
    return roundAddress
  } else {
    throw new Error('round address is 0x')
  }
}

matryxPlatformCalls.isTournamentCreator = async (tournamentAddress, userAddress) => {
  let tournamentContract = web3.eth.contract(tournamentAbi).at(tournamentAddress)
  let ownerAddress = await promisify(tournamentContract.owner)()
  return ownerAddress == userAddress
}

/*
* ROUND
*/
matryxPlatformCalls.isOpenRound = async (roundAddress) => {
  let roundContract = web3.eth.contract(roundAbi).at(roundAddress)
  let state = await promisify(roundContract.getState)()
  return state === 1
}

matryxPlatformCalls.isInRoundReviewPeriod = (roundAddress) => {
  let roundContract = web3.eth.contract(roundAbi).at(roundAddress)
  return promisify(roundContract.isInReview)()
}

matryxPlatformCalls.getParentTournamentFromRound = (roundAddress) => {
  let roundContract = web3.eth.contract(roundAbi).at(roundAddress)
  return promisify(roundContract.getTournament)()
}

matryxPlatformCalls.getRoundBounty = async (roundAddress) => {
  let roundContract = web3.eth.contract(roundAbi).at(roundAddress)
  let bounty = await promisify(roundContract.getBounty)()
  return +web3.fromWei(bounty.toString())
}

matryxPlatformCalls.getRoundSubmissions = (roundAddress) => {
  let roundContract = web3.eth.contract(roundAbi).at(roundAddress)
  return promisify(roundContract.getSubmissions)()
}

matryxPlatformCalls.getSubmissionAddressFromRound = (roundAddress, submissionIndex) => {
  let roundContract = web3.eth.contract(roundAbi).at(roundAddress)
  return promisify(roundContract.getSubmissionAddress)(submissionIndex)
}

matryxPlatformCalls.getSubmissionAuthorFromRound = (roundAddress, submissionAddress) => {
  let roundContract = web3.eth.contract(roundAbi).at(roundAddress)
  return promisify(roundContract.getSubmissionAuthor)(submissionAddress)
}

matryxPlatformCalls.getBalanceOfRound = async (roundAddress) => {
  let roundContract = web3.eth.contract(roundAbi).at(roundAddress)
  let balance = await promisify(roundContract.getBalance)()
  return +balance
}

matryxPlatformCalls.isSubmissionChosen = (roundAddress) => {
  let roundContract = web3.eth.contract(roundAbi).at(roundAddress)
  return promisify(roundContract.submissionChosen)()
}

matryxPlatformCalls.getWinningSubmissionAddress = (roundAddress) => {
  let roundContract = web3.eth.contract(roundAbi).at(roundAddress)
  return promisify(roundContract.getWinningSubmissionAddress)()
}

matryxPlatformCalls.numberOfSubmissions = async (roundAddress) => {
  let roundContract = web3.eth.contract(roundAbi).at(roundAddress)
  let num = await promisify(roundContract.numberOfSubmissions)()
  return +num
}

matryxPlatformCalls.roundStatus = async (roundAddress) => {
  let roundContract = web3.eth.contract(roundAbi).at(roundAddress)
  let state = await promisify(roundContract.getState)()
  if (state == 0) return 'isWaiting'
  else if (state == 1) return 'isOpen'
  else if (state == 2) return 'inReview'
  else if (state == 3) return 'isClosed'
  else if (state == 4) return 'isAbandoned'
}

matryxPlatformCalls.getSubmissionsFromRound = async (roundAddress) => {
  let response = {
    roundStatus: '',
    submissions: []
  }

  let status = await matryxPlatformCalls.roundStatus(roundAddress)
  response.roundStatus = status

  if (status == 'isWaiting' || status == 'inReview' || status == 'isOpen') return response

  if (status == 'isClosed' || status == 'isAbandoned') {
    let addresses = await matryxPlatformCalls.getRoundSubmissions(roundAddress)
    let submissionPromises = addresses.map(address => (async () => {
      let submissionContract = web3.eth.contract(submissionAbi).at(address)
      let [title, submissionDate] = await Promise.all([
        submissionContract.getTitle(),
        submissionContract.getTimeSubmitted()
      ])
      return { title, address, submissionDate }
    })())

    response.submissions = await Promise.all(submissionPromises)
    return response
  }
}

matryxPlatformCalls.getTournamentInfoFromRoundAddress = async (roundAddress) => {
  let tournamentAddress = await matryxPlatformCalls.getParentTournamentFromRound(roundAddress)
  let [tournamentTitle, tournamentDescription] = await Promise.all([
    matryxPlatformCalls.getTournamentTitle(tournamentAddress),
    matryxPlatformCalls.getTournamentDescription(tournamentAddress)
  ])
  return { tournamentTitle, tournamentDescription, tournamentAddress }
}

matryxPlatformCalls.getTournamentInfoFromRoundAddressNoIPFS = async (roundAddress) => {
  let tournamentAddress = await matryxPlatformCalls.getParentTournamentFromRound(roundAddress)
  let tournamentTitle = await matryxPlatformCalls.getTournamentTitle(tournamentAddress)
  let tournamentDescription = 'TODO fill in with valid description or err'
  return { tournamentTitle, tournamentDescription, tournamentAddress }
}

/*
* SUBMISSION
*/

matryxPlatformCalls.getSubmissionTitle = (submissionAddress) => {
  let submissionContract = web3.eth.contract(submissionAbi).at(submissionAddress)
  return promisify(submissionContract.getTitle)()
}

matryxPlatformCalls.getSubmissionAuthor = (submissionAddress) => {
  let submissionContract = web3.eth.contract(submissionAbi).at(submissionAddress)
  return promisify(submissionContract.getAuthor)()
}

matryxPlatformCalls.getSubmissionExternalAddress = async (submissionAddress) => {
  let submissionContract = web3.eth.contract(submissionAbi).at(submissionAddress)
  let externalAddress = await promisify(submissionContract.getExternalAddress)()
  return web3.toAscii(externalAddress)
}

matryxPlatformCalls.getSubmissionReferences = (submissionAddress) => {
  let submissionContract = web3.eth.contract(submissionAbi).at(submissionAddress)
  return promisify(submissionContract.getReferences)()
}

matryxPlatformCalls.getSubmissionContributors = (submissionAddress) => {
  let submissionContract = web3.eth.contract(submissionAbi).at(submissionAddress)
  return promisify(submissionContract.getContributors)()
}

matryxPlatformCalls.getSubmissionTimeSubmitted = async (submissionAddress) => {
  let submissionContract = web3.eth.contract(submissionAbi).at(submissionAddress)
  let timeSubmitted = await promisify(submissionContract.getTimeSubmitted)()
  return +timeSubmitted
}

matryxPlatformCalls.getSubmissionTimeUpdated = async (submissionAddress) => {
  let submissionContract = web3.eth.contract(submissionAbi).at(submissionAddress)
  let timeUpdated = await promisify(submissionContract.getTimeUpdated)()
  return +timeUpdated
}

matryxPlatformCalls.getSubmissionBalance = async (submissionAddress) => {
  let submissionContract = web3.eth.contract(submissionAbi).at(submissionAddress)
  let balance = await promisify(submissionContract.getBalance)()
  return +balance
}

matryxPlatformCalls.getRoundAddressFromSubmission = async (submissionAddress) => {
  let submissionContract = web3.eth.contract(submissionAbi).at(submissionAddress)
  let round = await promisify(submissionContract.getRound)()
  return +round
}

matryxPlatformCalls.getTournamentAddressFromSubmission = (submissionAddress) => {
  let submissionContract = web3.eth.contract(submissionAbi).at(submissionAddress)
  return promisify(submissionContract.getTournament)()
}

matryxPlatformCalls.getSubmissionDescription = async (submissionAddress) => {
  let submissionContract = web3.eth.contract(submissionAbi).at(submissionAddress)
  let externalAddress = await promisify(submissionContract.getExternalAddress)()
  externalAddress = web3.toAscii(externalAddress)
  return await ipfsCalls.getIpfsDescriptionOnly(externalAddress)
}

matryxPlatformCalls.getSubmissionContents = async (submissionAddress) => {
  let submissionContract = web3.eth.contract(submissionAbi).at(submissionAddress)
  let externalAddress = await promisify(submissionContract.getExternalAddress)()
  web3.toAscii(externalAddress)
  return await ipfsCalls.getIpfsDataFiles(externalAddress)
}

matryxPlatformCalls.getRoundInfoFromSubmission = async (submissionAddress) => {
  let roundAddress = await matryxPlatformCalls.getRoundAddressFromSubmission(submissionAddress)
  let bounty = await matryxPlatformCalls.getRoundBounty(roundAddress)
  return [roundAddress, +web3.fromWei(bounty.toString())]
}

matryxPlatformCalls.getTournamentInfoFromSubmission = async (submissionAddress) => {
  let tournamentAddress = await matryxPlatformCalls.getTournamentAddressFromSubmission(submissionAddress)
  let [title, currentRound] = await Promise.all([
    matryxPlatformCalls.getTournamentTitle(tournamentAddress),
    matryxPlatformCalls.currentRoundOfTournament(tournamentAddress)
  ])
  return [tournamentAddress, title, currentRound]
}

matryxPlatformCalls.getSubmissionParentInfo = async (submissionAddress) => {
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
  let submissionContract = web3.eth.contract(submissionAbi).at(submissionAddress)
  let ownerAddress = await promisify(submissionContract.owner)()
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

const methodsToLog = [
  // '*',
  'getTournamentDescription',
  'getTournamentInfoFromRoundAddress',
  'getTournamentInfoFromRoundAddressNoIPFS',
  'getSubmissionTitle',
  'getSubmissionAuthor',
  'getSubmissionExternalAddress',
  'getSubmissionReferences',
  'getSubmissionContributors',
  'getSubmissionTimeSubmitted',
  'getSubmissionTimeUpdated',
  'getSubmissionBalance',
  'getRoundAddressFromSubmission',
  'getTournamentAddressFromSubmission',
  'getSubmissionDescription',
  'getSubmissionContents',
  'getRoundInfoFromSubmission',
  'getTournamentInfoFromSubmission',
  'getSubmissionParentInfo',
]

const logger = new Proxy(matryxPlatformCalls, {
  get(obj, prop) {
    if (typeof obj[prop] !== 'function') return obj[prop]
    return function () {
      if (methodsToLog[0] === '*' || methodsToLog.includes(prop)) {
        const args = Array.from(arguments).join(',')
        console.log('>MatryxPlatformCalls: ' + prop + '(' + args + ')')
      }
      return obj[prop](...arguments)
    }
  }
})

module.exports = logger
