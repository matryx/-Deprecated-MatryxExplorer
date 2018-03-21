/*
The Matryx Platform controller

authors - sam@nanome.ai
Nanome 2018
*/

/*
Imports
*/
const externalApiCalls = require('./gateway/externalApiCalls')
const platformCalls = require('./gateway/platformCalls')
const platformInfo = require('../../data/abi/v2/platform')

var platformController = {}

platformController.latestPlatformInfo = function () {
  console.log(platformInfo)
  return platformInfo
}

// platformController.getActivity = function () {
//   return new Promise((resolve, reject) => {
//     let responseActivity = []
//     let news = {
//       news: ''
//     }
//
//     // TODO Logic
//     // Promise all
//     Promise.all(platformCalls.getPlatformActivity(), platformCalls.getTournamentActivity(), platformCalls.getRoundActivity())
//     .then((err, res) => {
//       console.log(res)
//
//         // Combine the outputs into one object
//       sortedResponses = res.sort(function (a, b) {
//         return a.blockNumber - b.blockNumber
//       })
//       console.log(sortedResponses)
//         // Sort by Block block number (largest to the top)
//       let latestResponses = sortedResponses[0:9]
//
//         // resolve the top 10
//         resolve(latestResponses)
//     })
//   })
// }

module.exports = platformController
