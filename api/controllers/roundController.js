
/*
The Matryx submission controller

authors - sam@nanome.ai
Nanome 2018
*/

/*
Imports
*/
const matryxPlatformCalls = require('./gateway/matryxPlatformCalls')

let roundController = {}

roundController.getRoundDetails = async function (roundAddress) {
  console.log('>RoundController: Retrieving Round Details for: ' + '\'' + roundAddress + '\'')

  // TODO: Check to see if the round is the current round of the tournament and return status Only
  let data = await Promise.all([
    matryxPlatformCalls.getTournamentInfoFromRoundAddress(roundAddress),
    matryxPlatformCalls.getRoundDetails(roundAddress),
    matryxPlatformCalls.getSubmissionsFromRound(roundAddress)
  ])

  let [tournamentInfo, roundDetails, submissionsFromRound] = data
  let { tournamentTitle, tournamentDescription, tournamentAddress } = tournamentInfo
  let { roundStatus, submissions } = submissionsFromRound

  return {
    tournamentTitle,
    tournamentDescription,
    tournamentAddress,
    ...roundDetails,
    roundStatus,
    submissions
  }
}
module.exports = roundController
