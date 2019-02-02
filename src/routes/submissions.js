/**
 * submissions.js
 * /submissions routes for getting Submission info
 *
 * Authors sam@nanome.ai dev@nanome.ai
 * Copyright (c) 2018, Nanome Inc
 * Licensed under ISC. See LICENSE.md in project root.
 */

const express = require('express')
const router = express.Router()

const submissionController = require('../controllers/submissionController')
const { errorHelper, validateRound, validateTournament } = require('../helpers/responseHelpers')
const asyncWrap = require('../middleware/asyncWrap')

const abis = require('../helpers/getAbis')

// Return a message showing this endpoint series handles submission requests
router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'handling GET requests to /submissions'
  })
})

router.get('/getAbi', (req, res, next) => {
  res.status(200).json(abis.submission)
})

// Return the submission details for a round address and commit hash
router.get('/by-round', asyncWrap(async (req, res, next) => {
  const { roundAddress, commitHash } = req.args
  if (!await validateRound(next, roundAddress)) return

  // TODO validate commit
  // if (!await validateCommit(next, commitHash)) return

  submissionController
    .getSubmission(roundAddress, commitHash)
    .then(submission => res.status(200).json({ submission }))
    .catch(errorHelper(next, `Error getting Submission ${commitHash} on Round ${roundAddress}`))
}))

// Return the submission details for a tournament address, round index, and commit hash
router.get('/by-tournament', asyncWrap(async (req, res, next) => {
  const { tournamentAddress, roundIndex, commitHash } = req.args
  if (!await validateTournament(next, tournamentAddress)) return

  // TODO validate commit
  // if (!await validateCommit(next, commitHash)) return

  submissionController
    .getSubmissionFromTournament(tournamentAddress, roundIndex, commitHash)
    .then(submission => res.status(200).json({ submission }))
    .catch(errorHelper(next, `Error getting Submission ${commitHash} on Tournament ${tournamentAddress}`))
}))

module.exports = router
