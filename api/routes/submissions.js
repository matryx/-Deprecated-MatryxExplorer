/*
MatryxExplorer API routing for all round based REST calls

author - sam@nanome.ai
Copyright Nanome Inc 2018
*/

const express = require('express')
const router = express.Router()

const externalApiCalls = require('../controllers/gateway/externalApiCalls')
const submissionController = require('../controllers/submissionController')
const { errorHelper, validateAddress } = require('../helpers/responseHelpers')

const latestVersion = process.env.PLATFORM_VERSION

// Return a message showing this endpoint series handles submission requests
router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'handling GET requests to /submissions'
  })
})

router.get('/getAbi/:version?', (req, res, next) => {
  let version = req.params.version || latestVersion

  externalApiCalls
    .getMatryxSubmissionAbi(version)
    .then(({ abi }) => res.status(200).json({ abi }))
    .catch(errorHelper(res, 'Error getting ABI for ' + version))
})

// Return the submission details for a specific submission address
router.get('/address/:submissionAddress', (req, res, next) => {
  const { submissionAddress } = req.params
  if (!validateAddress(res, submissionAddress)) return

  submissionController
    .getSubmissionByAddress(submissionAddress)
    .then(submission => res.status(200).json({ submission }))
    .catch(errorHelper(res, 'Error getting submission ' + submissionAddress))
})

// Return the submission owner/author for a specific submission address
router.get('/address/:submissionAddress/getOwner', (req, res, next) => {
  const { submissionAddress } = req.params
  if (!validateAddress(res, submissionAddress)) return

  submissionController
    .getSubmissionOwnerByAddress(submissionAddress)
    .then(owner => res.status(200).json({ owner }))
    .catch(errorHelper(res, 'Error getting owner of ' + submissionAddress))
})

// Return the submission owner/author for a specific submission address
router.get('/address/:submissionAddress/isCreator/:address', (req, res, next) => {
  const { submissionAddress, address } = req.params
  if (!validateAddress(res, submissionAddress) || !validateAddress(res, address)) return

  submissionController
    .isCreator(submissionAddress, address)
    .then(isCreator => res.status(200).json({ isCreator }))
    .catch(errorHelper(res, 'Error checking if ' + address + ' is creator of ' + submissionAddress))
})

/*
These are experiemental or old
*/

// // Return the submission details for a specific submission address
// router.get('/address/:submissionAddress', (req, res, next) => {
//   const address = req.params.submissionAddress
//   details = submissionController.getSubmissionByAddress(address).then(function (result) {
//     res.status(200).json({
//       submissionTitle: result._submissionTitle,
//       submissionAddress: address,
//       submissionAuthor: result._submissionAuthor,
//       submissionId: result._submissionId,
//       submissionDescription: result._submissionDescription,
//       submissionCollaborators: result._submissionCollaborators,
//       submissionReferences: result._submissionReferences,
//       submissionJson: result._submissionJson,
//       submissionIpfsHash: result._submissionIpfsHash,
//       submissionRewardTotal: result._submissionRewardTotal,
//       submissionSelectedRound: result._submissionSelectedRound,
//       submissionDate: result._submissionDate,
//       parentInfo: [
//         {
//           currentRound: result._parentInfo._currentRound,
//           totalRounds: result._parentInfo._totalRounds,
//           roundAddress: result._parentInfo._roundAddress,
//           roundMtx: result._parentInfo._roundMtx,
//           tournamentName: result._parentInfo._tournamentName,
//           tournamentAddress: result._parentInfo._tournamentAddress
//         }
//       ]
//     })
//   })
// })

module.exports = router
