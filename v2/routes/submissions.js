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

const externalApiCalls = require('../controllers/gateway/externalApiCalls')
const submissionController = require('../controllers/submissionController')
const { errorHelper, validateAddress } = require('../helpers/responseHelpers')


// Return a message showing this endpoint series handles submission requests
router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'handling GET requests to /submissions'
  })
})

router.get('/getAbi/:version?', (req, res, next) => {
  const { version } = req.params

  externalApiCalls
    .getMatryxSubmissionAbi(version)
    .then(({ abi }) => res.status(200).json({ abi }))
    .catch(errorHelper(next, `Error getting Submission ABI for ${version}`))
})

// Return the submission details for a specific submission address
router.get('/address/:submissionAddress', (req, res, next) => {
  const { submissionAddress } = req.params
  if (!validateAddress(next, submissionAddress)) return

  submissionController
    .getSubmissionByAddress(submissionAddress)
    .then(submission => res.status(200).json({ submission }))
    .catch(errorHelper(next, `Error getting Submission ${submissionAddress}`))
})

// Return the submission owner/author for a specific submission address
router.get('/address/:submissionAddress/owner', (req, res, next) => {
  const { submissionAddress } = req.params
  if (!validateAddress(next, submissionAddress)) return

  submissionController
    .getSubmissionOwnerByAddress(submissionAddress)
    .then(owner => res.status(200).json({ owner }))
    .catch(errorHelper(next, `Error getting Submission ${submissionAddress} owner`))
})

module.exports = router
