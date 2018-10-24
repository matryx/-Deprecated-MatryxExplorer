/**
 * submissionController.js
 * Helper methods for getting Submission data
 *
 * Authors sam@nanome.ai dev@nanome.ai
 * Copyright (c) 2018, Nanome Inc
 * Licensed under ISC. See LICENSE.md in project root.
 */

const ipfsCalls = require('./gateway/ipfsCalls')
const MatryxSubmission = require('../contracts/MatryxSubmission')

const abis = require('../helpers/getAbis')

let submissionController = {}

submissionController.getSubmissionOwnerByAddress = (submissionAddress) => {
  const Submission = new MatryxSubmission(submissionAddress, abis.submission.abi)
  return Submission.getOwner()
}

submissionController.getSubmissionByAddress = async (address) => {
  const Submission = new MatryxSubmission(address, abis.submission.abi)

  let data = await Submission.getData()

  const {
    owner,
    title,
    descHash,
    fileHash,
    contributors,
    references,
    reward,
    timeSubmitted
  } = data

  const description = await ipfsCalls.getIpfsFile(descHash)

  return {
    address,
    owner,
    title,
    description,
    fileHash,
    contributors,
    references,
    reward,
    timeSubmitted,
  }
}

module.exports = submissionController
