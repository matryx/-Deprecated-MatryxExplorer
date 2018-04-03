
/*
The Matryx submission controller

authors - sam@nanome.ai
Nanome 2018
*/

/*
Imports
*/
const externalApiCalls = require('./gateway/externalApiCalls')
const platformCalls = require('./gateway/platformCalls')
const ipfsCalls = require('./gateway/ipfsCalls')
const matryxPlatformCalls = require('./gateway/matryxPlatformCalls')

let roundController = {}

roundController.getRoundDetails = function (_roundAddress) {
  console.log('>RoundController: Retrieving Round Details for: ' + '\'' + _roundAddress + '\'')
  console.log(typeof _roundAddress)
  return new Promise((resolve, reject) => {
    let roundResponse = {
      tournamentTitle: '',
      tournamentDescription: '',
      tournamentAddress: '',
      roundMtx: 0,
      roundStatus: '',
      submissions: []
    }

    let promiseCallStack = []

// TODO: Check to see if the round is the current round of the tournament and return status Only

    promiseCallStack.push(matryxPlatformCalls.getTournamentInfoFromRoundAddress(_roundAddress))
    promiseCallStack.push(matryxPlatformCalls.getRoundBounty(_roundAddress))

    // This should also return an empty submissions list
    promiseCallStack.push(matryxPlatformCalls.getSubmissionsFromRound(_roundAddress))

    Promise.all(promiseCallStack).then(function (values) {
      console.log('The values are: ')
      console.log(values)
      roundResponse.tournamentTitle = values[0].tournamentTitle
      roundResponse.roundMtx = values[1]
      roundResponse.tournamentDescription = values[0].tournamentDescription
      roundResponse.tournamentAddress = values[0].tournamentAddress
      roundResponse.roundStatus = values[2].roundStatusValue
      roundResponse.submissions = values[2].submissionResults
      console.log(values[2])

      resolve(roundResponse)
    })
  })
}
module.exports = roundController
