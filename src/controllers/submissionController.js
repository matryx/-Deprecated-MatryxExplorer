/**
 * submissionController.js
 * Helper methods for getting Submission data
 *
 * Authors sam@nanome.ai dev@nanome.ai
 * Copyright (c) 2018, Nanome Inc
 * Licensed under ISC. See LICENSE.md in project root.
 */

const ipfsCalls = require('./gateway/ipfsCalls')

const MatryxTournament = require('../contracts/MatryxTournament')
const MatryxRound = require('../contracts/MatryxRound')

const abis = require('../helpers/getAbis')
const contracts = require('../helpers/getContracts')

let submissionController = {}

submissionController.getSubmission = async (roundAddress, commitHash) => {
  const Commit = contracts.commit
  const Round = new MatryxRound(roundAddress, abis.round.abi)

  const [submission, commit] = await Promise.all([
    Round.getSubmission(commitHash),
    Commit.getCommit(commitHash)
  ])

  const { title, descHash, timeSubmitted, reward } = submission
  const { owner, contentHash } = commit

  const description = await ipfsCalls.getIpfsFile(descHash)

  return {
    commitHash,
    owner,
    title,
    description,
    fileHash: contentHash,
    reward,
    timeSubmitted
  }
}

submissionController.getSubmissionFromTournament = async (tournamentAddress, roundIndex, commitHash) => {
  const Tournament = new MatryxTournament(tournamentAddress, abis.tournament.abi)
  const rounds = await Tournament.getRounds()
  const roundAddress = rounds[roundIndex]

  return submissionController.getSubmission(roundAddress, commitHash)
}

module.exports = submissionController
