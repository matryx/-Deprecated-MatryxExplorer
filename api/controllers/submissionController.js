/*
The Matryx submission controller

authors - sam@nanome.ai
Nanome 2018
*/

/*
Imports
*/

const ipfsCalls = require('./gateway/ipfsCalls')
const matryxPlatformCalls = require('./gateway/matryxPlatformCalls')

let submissionController = {}

submissionController.getSubmissionOwnerByAddress = (submissionAddress) => {
  return matryxPlatformCalls.getSubmissionOwner(submissionAddress)
}

submissionController.getIpfsDataForSubmission = (ipfsHash) => {
  console.log('Making gateway call...')
  return ipfsCalls.getIpfsData(ipfsHash)
}

submissionController.uploadToIpfs = (files) => {
  console.log('Making gateway call...')
  return ipfsCalls.uploadToIpfs(files)
}

submissionController.getSubmissionByAddress = async (submissionAddress) => {
  console.log('Executing submissionController for getting submission details at: ' + '\'' + submissionAddress + '\'')

  let data = await Promise.all([
    matryxPlatformCalls.getSubmissionTitle(submissionAddress),
    matryxPlatformCalls.getSubmissionOwner(submissionAddress),
    matryxPlatformCalls.getSubmissionReward(submissionAddress),
    matryxPlatformCalls.getSubmissionDescription(submissionAddress),
    matryxPlatformCalls.getSubmissionContributors(submissionAddress),
    matryxPlatformCalls.getSubmissionReferences(submissionAddress),
    matryxPlatformCalls.getSubmissionContents(submissionAddress),
    matryxPlatformCalls.getSubmissionExternalAddress(submissionAddress),
    matryxPlatformCalls.getSubmissionTimeSubmitted(submissionAddress),
    matryxPlatformCalls.getSubmissionParentInfo(submissionAddress)
  ])

  let [
    submissionTitle,
    submissionOwner,
    submissionReward,
    submissionDescription,
    submissionCollaborators,
    submissionReferences,
    submissionContents,
    submissionExternalAddress,
    submissionDate,
    parentInfo
  ] = data

  return {
    submissionAddress,
    submissionTitle,
    submissionOwner,
    submissionReward,
    submissionDescription,
    submissionCollaborators,
    submissionReferences,
    submissionContents, // turn this into a [] ?
    submissionExternalAddress,
    submissionDate,
    parentInfo
  }
}

submissionController.isCreator = (submissionAddress, userAddress) => {
  return matryxPlatformCalls.isSubmissionCreator(submissionAddress, userAddress)
}

/*
EXPERIMENTAL
*/
//
// submissionController.getSubmissionByAddressNoIPFS = function (_submissionAddress) {
//   console.log('Executing submissionController for getting submission details at: ' + '\'' + _submissionAddress + '\'')
//   return new Promise((resolve, reject) => {
//     let submissionDataCalls = []
//
//     let submissionData = {
//       submissionTitle: '',
//       submissionAddress: '',
//       submissionAuthor: '',
//       submissionId: '',
//       submissionDescription: '',
//       submissionCollaborators: [],
//       submissionReferences: [],
//       submissionContents: [],
//       submissionExternalAddress: '',
//       submissionRewardTotal: 0,
//       submissionSelectedRound: 0,
//       submissionDate: '',
//       parentInfo: []
//     }
//     let parentInfoItem = {
//       currentRound: 0,
//       roundAddress: '',
//       roundMtx: 0,
//       tournamentName: '',
//       tournamentAddress: ''
//     }
//
//     submissionDataCalls.push(matryxPlatformCalls.getSubmissionTitle(_submissionAddress))
//     submissionDataCalls.push(matryxPlatformCalls.getSubmissionAuthor(_submissionAddress))
//     // submissionDataCalls.push(matryxPlatformCalls.getSubmissionDescription(_submissionAddress))
//     submissionDataCalls.push(matryxPlatformCalls.getSubmissionContributors(_submissionAddress))
//     submissionDataCalls.push(matryxPlatformCalls.getSubmissionReferences(_submissionAddress))
//     submissionDataCalls.push(matryxPlatformCalls.getSubmissionContents(_submissionAddress))
//     submissionDataCalls.push(matryxPlatformCalls.getSubmissionExternalAddress(_submissionAddress))
//     // submissionDataCalls.push(matryxPlatformCalls.getSubmissionBalance(_submissionAddress))
//     // submissionDataCalls.push(matryxPlatformCalls.getSubmissionSelectedRound(_submissionAddress))
//     submissionDataCalls.push(matryxPlatformCalls.getSubmissionTimeSubmitted(_submissionAddress))
//     submissionDataCalls.push(matryxPlatformCalls.getSubmissionParentInfo(_submissionAddress))
//           // Promise all for the data inside the submissions
//
//     Promise.all(submissionDataCalls).then(function (values) {
//               // Attach to the submissions Data
//       console.log('Values of submission details after promise all: ' + values)
//       submissionData.submissionTitle = values[0]
//       submissionData.submissionAddress = _submissionAddress
//       submissionData.submissionAuthor = values[1]
//       submissionData.submissionId = ''
//       submissionData.submissionDescription = 'submission description filler instance'
//       submissionData.submissionCollaborators = values[2]
//       submissionData.submissionReferences = values[3]
//       submissionData.submissionContents = values[4] // turn this into a []
//       submissionData.submissionExternalAddress = values[5]
//       // submissionData.submissionRewardTotal = values[5]
//       submissionData.submissionSelectedRound = 0
//       submissionData.submissionDate = values[6]
//       submissionData.parentInfo = values[7]
//             // submissions.submissions = values[10]
//
//       resolve(submissionData)
//     }).catch((err) => {
//       reject(err)
//     })
//   })
// }

module.exports = submissionController
