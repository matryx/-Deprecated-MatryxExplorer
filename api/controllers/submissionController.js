/*
The Matryx submission controller

authors - sam@nanome.ai
Nanome 2018
*/

/*
Imports
*/
const externalApiCalls = require('./eth/externalApiCalls')
const platformCalls = require('./eth/platformCalls')

var submissionController = {}

submissionController.getSubmissionCount = function (_submissionAddress) {
  return new Promise((resolve, reject) => {
    platformCalls.getSubmissionCount(_submissionAddress).then(function (result) {
      resolve(result)
    }).catch((err) => {
      console.log('Not able to retrieve submission count. ' + err)
    })
  })
}

submissionController.getSubmissionByAddress = function (_submissionAddress) {
  return new Promise((resolve, reject) => {
    platformCalls.getSubmissionByAddress(_submissionAddress).then(function (result) {
      let description = externalApiCalls.getIpfsData(result._submissionIpfsHash)
      result._submissionDescription = description
      // result.submissionJson = submissionFile
      console.log(result)
      resolve(result)
    }).catch((err) => {
      console.log('Not able to get submission Details. ' + err)
    })
  })
}

submissionController.getSubmissionOwnerByAddress = function (_submissionAddress) {
  return new Promise((resolve, reject) => {
    platformCalls.getSubmissionOwnerByAddress(_submissionAddress).then(function (result) {
      resolve(result)
    }).catch((err) => {
      console.log('Not able to retrieve submission owner. ' + err)
    })
  })
}

module.exports = submissionController
