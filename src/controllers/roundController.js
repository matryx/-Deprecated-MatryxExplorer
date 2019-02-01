/**
 * roundController.js
 * Helper methods for getting Round data
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

let roundController = {}

roundController.getSubmissionsFromRound = async (roundAddress) => {
  const Commit = contracts.commit
  const Round = new MatryxRound(roundAddress, abis.round.abi)

  let response = {
    roundStatus: '',
    submissions: []
  }

  let status = await Round.getState()
  response.roundStatus = status

  // istanbul ignore next
  if (['notYetOpen', 'notFunded', 'isOpen', 'inReview'/*, 'hasWinners' */].includes(status)) return response

  else if (['hasWinners', 'isClosed', 'isAbandoned'].includes(status)) {
    let [winners, submissions] = await Promise.all([
      Round.getWinningSubmissions(),
      Round.getSubmissions()
    ])

    let submissionPromises = submissions.map(async sHash => {
      const [submission, commit] = await Promise.all([
        Round.getSubmission(sHash),
        Commit.getCommit(sHash)
      ])

      let winner = winners.includes(sHash)

      const { title, timeSubmitted, reward } = submission
      const { owner } = commit

      return { commitHash: sHash, owner, title, winner, reward, timeSubmitted }
    })

    response.submissions = await Promise.all(submissionPromises)
    return response
  }
}

roundController.getRoundDetails = async function (roundAddress) {
  const Round = new MatryxRound(roundAddress, abis.round.abi)

  let data = await Promise.all([
    Round.getData(),
    roundController.getSubmissionsFromRound(roundAddress)
  ])

  const [roundDetails, submissionsFromRound] = data
  const { roundStatus, submissions } = submissionsFromRound

  const Tournament = new MatryxTournament(roundDetails.tournament, abis.tournament.abi)

  data = await Promise.all([
    Tournament.getTitle(),
    Tournament.getDescriptionHash()
  ])
  const [tournamentTitle, descriptionHash] = data

  const tournamentDescription = await ipfsCalls.getIpfsFile(descriptionHash)

  return {
    tournamentTitle,
    tournamentDescription,
    ...roundDetails,
    roundStatus,
    submissions
  }
}
module.exports = roundController
