/*
TempAPI MatryxExplorer API routing for all tournament based REST calls

author - sam@nanome.ai
Copyright Nanome Inc 2018
*/

const express = require('express')
const router = express.Router()

const ethPlatform = require('../api/controllers/eth/platformCalls')

// Return a list of all tournaments
router.get('/', (req, res, next) => {
  var tournaments = {
    tournaments: [
      {
        tournamentTitle: 'Solve Aids',
        mtx: 200000.0,
        tournamentDescription: 'A description of the tournament',
        category: 'Pharma',
        totalRounds: 3,
        currentRound: 1,
        numberOfParticipants: 130,
        address: '0xa43e6937e49176fd886dcf96850816e324e4d06c',
        ipType: '50/50',
        tournamentID: 1
      },
      {
        tournamentTitle: 'Help Keita find a home',
        mtx: 240000.2,
        tournamentDescription: 'A description of the tournament',
        category: 'Space',
        totalRounds: 5,
        currentRound: 3,
        numberOfParticipants: 220,
        address: '0xa43e6937e49176fd886dcf96850816e324e4d06d',
        ipType: 'bountyPoster',
        tournamentID: 2
      },
      {
        tournamentTitle: 'Create an Exotic Mug',
        mtx: 240000.2,
        tournamentDescription: 'A description of the tournament',
        category: 'Art',
        totalRounds: 2,
        currentRound: 1,
        address: '0xa43e6937e49176fd886dcf96850816e324e4d06e',
        numberOfParticipants: 80,
        ipType: 'bountySubmitter',
        tournamentID: 3
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
  var tournamentDetails = {
    tournamentTitle: 'Solve Aids',
    mtx: '200000.00000',
    authorName: '0xe665Dd2C090c7ceFD5C40cb9de00830108A62785',
    tournamentDescription: 'A description of the tournament',
    category: 'Pharma',
    totalRounds: '3',
    currentRound: '1',
    numberOfParticipants: '130',
    ipType: '50/50',
    roundEndTime: '1519427539',
    participationMTX: '400',
    roundReward: '20000',
    recentSubmissions: [
      {
        submissionTitle: 'SubmissionTitle1',
        authorName: '0xe665Dd2C090c7ceFD5C40cb9de00830108A62785',
        submissionDate: '1519427539',
        submissionAddress: '0xe665Dd2C090c7ceFD5C40cb9de00830108A62710'
      },
      {
        submissionTitle: 'SubmissionTitle2',
        authorName: '0xe665Dd2C090c7ceFD5C40cb9de00830108A62785',
        submissionDate: '1519427539',
        submissionAddress: '0xe665Dd2C090c7ceFD5C40cb9de00830108A62710'
      },
      {
        submissionTitle: 'SubmissionTitle3',
        authorName: '0xe665Dd2C090c7ceFD5C40cb9de00830108A62785',
        submissionDate: '1519427539',
        submissionAddress: '0xe665Dd2C090c7ceFD5C40cb9de00830108A62710'
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
  var tournamentDetails = {
    tournamentTitle: 'Solve Aids',
    mtx: '200000.00000',
    authorName: '0xe665Dd2C090c7ceFD5C40cb9de00830108A62785',
    tournamentDescription: 'A description of the tournament',
    category: 'Pharma',
    totalRounds: '3',
    currentRound: '1',
    numberOfParticipants: '130',
    ipType: '50/50',
    roundEndTime: '1519427539',
    participationMTX: '400',
    roundReward: '20000',
    recentSubmissions: [
      {
        submissionTitle: 'SubmissionTitle1',
        authorName: '0xe665Dd2C090c7ceFD5C40cb9de00830108A62785',
        submissionDate: '1519427539'
      },
      {
        submissionTitle: 'SubmissionTitle2',
        authorName: '0xe665Dd2C090c7ceFD5C40cb9de00830108A62785',
        submissionDate: '1519427539'
      },
      {
        submissionTitle: 'SubmissionTitle3',
        authorName: '0xe665Dd2C090c7ceFD5C40cb9de00830108A62785',
        submissionDate: '1519427539'
      }
    ]
  }
  res.status(200).json({
    message: 'This is a temp API with tournamentID' + address,
    data: tournamentDetails
  })
})

module.exports = router
