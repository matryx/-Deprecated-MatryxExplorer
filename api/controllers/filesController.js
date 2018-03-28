/*
The Matryx Platform controller

authors - sam@nanome.ai
Nanome 2018
*/

/*
Imports
*/

const ipfsCalls = require('./gateway/ipfsCalls')
let filesController = {}

filesController.latestPlatformInfo = function () {
  console.log('filesController')
  return 'filesController'
}

filesController.basicDescriptionUploadToIPFS = function (descriptionContent) {
  return new Promise((resolve, reject) => {
    ipfsCalls.uploadToIpfs(descriptionContent).then(function (result) {
      resolve(result)
    }).catch((err) => {
      console.log('Not able to retrieve latest round. ' + err)
    })
  })
}

module.exports = filesController
