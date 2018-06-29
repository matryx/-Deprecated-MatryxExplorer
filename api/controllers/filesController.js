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

filesController.basicDescriptionUploadToIPFS = (descriptionContent) => {
  return ipfsCalls.uploadToIpfs(descriptionContent)
}

module.exports = filesController
