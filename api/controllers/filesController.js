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

filesController.basicDescriptionUploadToIPFS = function (descriptionContent) {
  return new Promise((resolve, reject) => {
    ipfsCalls.uploadToIpfs(descriptionContent).then(function (result) {
      resolve(result)
    }).catch((err) => {
      reject(err)
    })
  })
}

module.exports = filesController
