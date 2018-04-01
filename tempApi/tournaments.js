/*
TempAPI MatryxExplorer API routing for all tournament based REST calls

author - sam@nanome.ai
Copyright Nanome Inc 2018
*/

const express = require('express')
const router = express.Router()

// Return a list of all tournaments
router.get('/', (req, res, next) => {
  let tournaments = {
    'tournaments': [
      {
        'tournamentTitle': 'Solve Aids',
        'mtx': 200000.00000,
        'tournamentDescription': 'A description of the tournament',
        'category': 'Pharma',
        'totalRounds': 3,
        'currentRound': 1,
        'numberOfParticipants': 130,
        'address': '0xa43e6937e49176fd886dcf96850816e324e4d06c',
        'ipType': '50/50',
        'tournamentID': 1,
        'externalAddress': 'QmYdbXBhekWjoTu3kKYb7NLJFy6bG9USCP6TVAPm8hhQ7e'
      },
      {
        'tournamentTitle': 'Help Keita find a home',
        'mtx': 240000.20000,
        'tournamentDescription': 'A description of the tournament',
        'category': 'Space',
        'totalRounds': 5,
        'currentRound': 3,
        'numberOfParticipants': 220,
        'address': '0xa43e6937e49176fd886dcf96850816e324e4d06d',
        'ipType': 'bountyPoster',
        'tournamentID': 2,
        'externalAddress': 'QmYdbXBhekWjoTu3kKYb7NLJFy6bG9USCP6TVAPm8hhQ7e'

      },
      {
        'tournamentTitle': 'Create an Exotic Mug',
        'mtx': 240000.20000,
        'tournamentDescription': 'A description of the tournament',
        'category': 'Art',
        'totalRounds': 2,
        'currentRound': 1,
        'address': '0xa43e6937e49176fd886dcf96850816e324e4d06e',
        'numberOfParticipants': 80,
        'ipType': 'bountySubmitter',
        'tournamentID': 3,
        'externalAddress': 'QmYdbXBhekWjoTu3kKYb7NLJFy6bG9USCP6TVAPm8hhQ7e'

      }
    ]
  }
  res.status(200).json({
    message: 'API working',
    data: tournaments
  })

  // json(json_data(tournaments))
})

// Return the tournament details for a specific tournament
router.get('/id/:tournamentID', (req, res, next) => {
  const id = req.params.tournamentID
  let tournamentDetails = {
    'tournamentTitle': 'Solve Aids',
    'tournamentAddress': '0xe665Dd2C090c7ceFD5C40cb9de00830108A62722',
    'mtx': '200000.00000',
    'authorName': '0xe665Dd2C090c7ceFD5C40cb9de00830108A62785',
    'tournamentDescription': 'A description of the tournament',
    'category': 'Pharma',
    'totalRounds': '3',
    'currentRound': '1',
    'numberOfParticipants': '130',
    'ipType': '50/50',
    'roundEndTime': '1519427539',
    'participationMTX': '400',
    'roundReward': '20000',
    'recentSubmissions': [
      {
        'submissionTitle': 'SubmissionTitle1',
        'authorName': '0xe665Dd2C090c7ceFD5C40cb9de00830108A62785',
        'submissionDate': '1519427539',
        'submissionAddress': '0xe665Dd2C090c7ceFD5C40cb9de00830108A62710'
      },
      {
        'submissionTitle': 'SubmissionTitle2',
        'authorName': '0xe665Dd2C090c7ceFD5C40cb9de00830108A62785',
        'submissionDate': '1519427539',
        'submissionAddress': '0xe665Dd2C090c7ceFD5C40cb9de00830108A62710'
      },
      {
        'submissionTitle': 'SubmissionTitle3',
        'authorName': '0xe665Dd2C090c7ceFD5C40cb9de00830108A62785',
        'submissionDate': '1519427539',
        'submissionAddress': '0xe665Dd2C090c7ceFD5C40cb9de00830108A62710'
      }
    ]
  }
  res.status(200).json({
    message: 'This is a temp API with tournamentID' + id,
    data: tournamentDetails
  })
})

// Return the tournament details for a specific tournament
router.get('/address/:tournamentAddress', (req, res, next) => {
  const address = req.params.tournamentAddress
  let tournamentDetails = {
    'tournamentTitle': 'Solve Aids',
    'tournamentAddress': '0xe665Dd2C090c7ceFD5C40cb9de00830108A62722',
    'mtx': '200000.00000',
    'authorName': '0xe665Dd2C090c7ceFD5C40cb9de00830108A62785',
    'tournamentDescription': 'A description of the tournament',
    'category': 'Pharma',
    'totalRounds': '3',
    'currentRound': '1',
    'numberOfParticipants': '130',
    'ipType': '50/50',
    'roundEndTime': '1519427539',
    'participationMTX': '400',
    'roundReward': '20000',
    'recentSubmissions': [
      {
        'submissionTitle': 'SubmissionTitle1',
        'authorName': '0xe665Dd2C090c7ceFD5C40cb9de00830108A62785',
        'submissionDate': '1519427539'
      },
      {
        'submissionTitle': 'SubmissionTitle2',
        'authorName': '0xe665Dd2C090c7ceFD5C40cb9de00830108A62785',
        'submissionDate': '1519427539'
      },
      {
        'submissionTitle': 'SubmissionTitle3',
        'authorName': '0xe665Dd2C090c7ceFD5C40cb9de00830108A62785',
        'submissionDate': '1519427539'
      }
    ]
  }
  res.status(200).json({
    message: 'This is a temp API with tournamentID' + address,
    data: tournamentDetails
  })
})

  // Return the tournament details for a specific tournament
router.get('/address/:tournamentAddress/round/:roundId', (req, res, next) => {
  const id = req.params.roundId
  const address = req.params.tournamentAddress
  let roundDetails =
    {
      'roundBounty': 100,
      'roundAddress': address,
      'roundStatus': 'open',
      'winningSubmissions': [
        {
          'submissionAddress': '0xa0e239b0abf4582366adaff486ee268c848c4409',
          'mtxPayout': '90'
        },
        {
          'submissionAddress': '0xa0e239b0abf4582366adaff486ee268c848c4499',
          'mtxPayout': '10'
        }
      ],
      'submissions':
      [
        {
          'address': '0xa0e239b0abf4582366adaff486ee268c848c4409',
          'title': 'Lift-to-drag maximization for single airfoil at M = 0.63',
          'submissionDate': '1519427539'

        },
        {
          'address': '0x851b7f3ab81bd8df354f0d7640efcd7288553419',
          'title': 'High Lift, Low Aspect Ratio Airfoil',
          'submissionDate': '1519427539'

        },
        {
          'address': '0x32be343b94f860124dc4fee278fdcbd38c102d88',
          'title': 'Low Reynolds Number Airfoil',
          'submissionDate': '1519427539'

        }
      ]
    }

  res.status(200).json({
    message: 'This is a temp API with tournamentID' + address,
    data: roundDetails
  })
})

module.exports = router
