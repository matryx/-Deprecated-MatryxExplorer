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

let submissionController = {}

submissionController.getSubmissionOwnerByAddress = function (_submissionAddress) {
  return new Promise((resolve, reject) => {
    matryxPlatformCalls.getSubmissionAuthor(_submissionAddress).then(function (result) {
      resolve(result)
    }).catch((err) => {
      console.log('Not able to retrieve submission owner. ' + err)
    })
  })
}

submissionController.getIpfsDataForSubmission = function (_submissionAddress, _ipfsHash) {
  return new Promise((resolve, reject) => {
    console.log('Making gateway call...')
    ipfsCalls.getIpfsData(_ipfsHash).then(function (result) {
      console.log(result)
      resolve(result)
    }).catch((err) => {
      console.log('Not able to retrieve submission owner. ' + err)
    })
  })
}

submissionController.uploadToIpfs = function (_files) {
  return new Promise((resolve, reject) => {
    console.log('Making gateway call...')
    ipfsCalls.uploadToIpfs(_files).then(function (result) {
      console.log(result)
      resolve(result)
    }).catch((err) => {
      console.log('Not able to upload to IPFS. ' + err)
    })
  })
}

/*
EXPERIMENTAL
*/

submissionController.getSubmissionByAddress = function (_submissionAddress) {
  console.log('Executing submissionController for getting submission details at: ' + '\'' + _submissionAddress + '\'')
  return new Promise((resolve, reject) => {
    let submissionDataCalls = []

    let submissionData = {
      submissionTitle: '',
      submissionAddress: '',
      submissionAuthor: '',
      submissionId: '',
      submissionDescription: '',
      submissionCollaborators: [],
      submissionReferences: [],
      submissionContents: [],
      submissionExternalAddress: '',
      submissionRewardTotal: 0,
      submissionSelectedRound: 0,
      submissionDate: '',
      parentInfo: []
    }
    let parentInfoItem = {
      currentRound: 0,
      roundAddress: '',
      roundMtx: 0,
      tournamentName: '',
      tournamentAddress: ''
    }

    submissionDataCalls.push(matryxPlatformCalls.getSubmissionTitle(_submissionAddress))
    submissionDataCalls.push(matryxPlatformCalls.getSubmissionAuthor(_submissionAddress))
    // submissionDataCalls.push(matryxPlatformCalls.getSubmissionDescription(_submissionAddress)) //// TODO: MAX
    submissionDataCalls.push(matryxPlatformCalls.getSubmissionContributors(_submissionAddress))
    submissionDataCalls.push(matryxPlatformCalls.getSubmissionReferences(_submissionAddress))
    // submissionDataCalls.push(matryxPlatformCalls.getSubmissionContents(_submissionAddress)) // TODO: MAX
    submissionDataCalls.push(matryxPlatformCalls.getSubmissionExternalAddress(_submissionAddress))
    // submissionDataCalls.push(matryxPlatformCalls.getSubmissionBalance(_submissionAddress))
    // submissionDataCalls.push(matryxPlatformCalls.getSubmissionSelectedRound(_submissionAddress)) // TODO: MAX what is this
    submissionDataCalls.push(matryxPlatformCalls.getSubmissionTimeSubmitted(_submissionAddress))
    // submissionDataCalls.push(matryxPlatformCalls.getSubmissionParentInfo(_submissionAddress))
          // Promise all for the data inside the submissions

    Promise.all(submissionDataCalls).then(function (values) {
              // Attach to the submissions Data
      console.log('Values of submission details after promise all: ' + values)
      submissionData.submissionTitle = values[0]
      submissionData.submissionAddress = _submissionAddress
      submissionData.submissionAuthor = values[1]
      submissionData.submissionId = ''
      submissionData.submissionDescription = 'Waiting for valid IPFS hash' // TODO:
      submissionData.submissionCollaborators = values[2]
      submissionData.submissionReferences = values[3]
      // submissionData.submissionContents = values[5]
      submissionData.submissionExternalAddress = values[4]
      // submissionData.submissionRewardTotal = values[5]
      submissionData.submissionSelectedRound = 0
      submissionData.submissionDate = values[5]
      // submissionData.parentInfo = values[6]
            // submissions.submissions = values[10]

      resolve(submissionData)
    })
  })
}

submissionController.uploadJsonAndDescriptionToIPFS = function (jsonContent, description) {
  return new Promise((resolve, reject) => {
    console.log('Making gateway call...')
    ipfsCalls.uploadJsonAndDescriptionToIPFS(jsonContent, description).then(function (result) {
      console.log(result)
      resolve(result)
    }).catch((err) => {
      console.log('Not able to upload to IPFS. ' + err)
    })
  })
}

module.exports = submissionController
