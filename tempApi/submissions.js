/*
MatryxExplorer API routing for all tournament based REST calls

author - sam@nanome.ai
Copyright Nanome Inc 2018
*/

const express = require('express')
const router = express.Router()

// Welcome to rounds
router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'handling GET requests to /submission'
  })
})

// Return the tournament details for a specific tournament
router.get('/id/:submissionID/', (req, res, next) => {
  const id = req.params.submissionID
  let submissionDetails = {
    'submissionTitle': "Sam's Submission",
    'submissionAddress': '0x15528Fc3CFf56b4667f988C699ec5983030Ce841',
    'submissionAuthor': '0x15528Fc3CFf56b4667f988C699ec5983030Ce842',
    'submissionId': '44',
    'submissionDescription': 'NanoPro is the future',
    'submissionCollaborators': [
      '0x11f2915576Dc51dFFB246959258E8fe5a1913161',
      '0x0327FF417aa111b61bED5F39e77946b38d6592B3'
    ],
    'submissionReferences': [
      '0x0327FF417aa111b61bED5F39e77946b38d6592B3',
      '0x58bA5d062E2c2B14DC8B8458872AFef70A9b25EB'
    ],
    'submissionJson': [
      {
        'Items': [
          '{"rangeKeys":["t","u","v","w"],"rangePairs":[{"min":{"exclusive":false,"rawText":"0"},"max":{"exclusive":false,"rawText":"8*pi"}},{"min":{"exclusive":false,"rawText":"0"},"max":{"exclusive":false,"rawText":"0"}},{"min":{"exclusive":false,"rawText":"0"},"max":{"exclusive":false,"rawText":"0"}},{"min":{"exclusive":false,"rawText":"0"},"max":{"exclusive":false,"rawText":"0"}}],"ExpressionKeys":[0,1,2],"ExpressionValues":["cos(t)*(2-cos(t))","(sin(t))*(2-cos(t))","-sin(2*t)+(cos(t)-.5)"]}'
        ]
      }
    ],
    'submissionIpfsHash': 'QmT9qk3CRYbFDWpDFYeAv8T8H1gnongwKhh5J68NLkLir6',
    'submissionRewardTotal': 1,
    'submissionSelectedRound': 1,
    'submissionDate': '',
    'parentInfo': [
      {
        'currentRound': '1',
        'totalRounds': '3',
        'roundAddress': '0x11f2915576Dc51dFFB246959258E8fe5a1913161',
        'roundMtx': 30,
        'tournamentName': "Sam's Tournament",
        'tournamentAddress': '0x11f2915576Dc51dFFB246959258E8fe5a1913161'
      }
    ]
  }
  res.status(200).json({
    message: 'This is a temp API for submission details by passing in submissionID' + id,
    data: submissionDetails
  })
})

// Return the tournament details for a specific tournament
router.get('/address/:submissionAddress', (req, res, next) => {
  const address = req.params.submissionAddress
  let submissionAddress = {
    'submissionTitle': "Sam's Submission",
    'submissionAddress': '0x15528Fc3CFf56b4667f988C699ec5983030Ce841',
    'submissionAuthor': '0x15528Fc3CFf56b4667f988C699ec5983030Ce842',
    'submissionId': '44',
    'submissionDescription': 'NanoPro is the future',
    'submissionCollaborators': [
      '0x11f2915576Dc51dFFB246959258E8fe5a1913161',
      '0x0327FF417aa111b61bED5F39e77946b38d6592B3'
    ],
    'submissionReferences': [
      '0x0327FF417aa111b61bED5F39e77946b38d6592B3',
      '0x58bA5d062E2c2B14DC8B8458872AFef70A9b25EB'
    ],
    'submissionJson': [
      {
        'Items': [
          '{"rangeKeys":["t","u","v","w"],"rangePairs":[{"min":{"exclusive":false,"rawText":"0"},"max":{"exclusive":false,"rawText":"8*pi"}},{"min":{"exclusive":false,"rawText":"0"},"max":{"exclusive":false,"rawText":"0"}},{"min":{"exclusive":false,"rawText":"0"},"max":{"exclusive":false,"rawText":"0"}},{"min":{"exclusive":false,"rawText":"0"},"max":{"exclusive":false,"rawText":"0"}}],"ExpressionKeys":[0,1,2],"ExpressionValues":["cos(t)*(2-cos(t))","(sin(t))*(2-cos(t))","-sin(2*t)+(cos(t)-.5)"]}'
        ]
      }
    ],
    'submissionIpfsHash': 'QmT9qk3CRYbFDWpDFYeAv8T8H1gnongwKhh5J68NLkLir6',
    'submissionRewardTotal': 1,
    'submissionSelectedRound': 1,
    'submissionDate': '',
    'parentInfo': [
      {
        'currentRound': '1',
        'totalRounds': '3',
        'roundAddress': '0x11f2915576Dc51dFFB246959258E8fe5a1913161',
        'roundMtx': 30,
        'tournamentName': "Sam's Tournament",
        'tournamentAddress': '0x11f2915576Dc51dFFB246959258E8fe5a1913161'
      }
    ]
  }
  res.status(200).json({
    message: 'This is a temp API for submission details with Submission Address' + address,
    data: submissionAddress
  })
})

// router.post('/', (req, res, next) => {
//     res.status(200).json({
//         message: 'handling POST requests to /products'
//     });
// });

module.exports = router
