/**
 * userController.js
 * Helper methods for getting User data
 *
 * Authors dev@nanome.ai
 * Copyright (c) 2018, Nanome Inc
 * Licensed under ISC. See LICENSE.md in project root.
 */

const abis = require('../helpers/getAbis')
const contracts = require('../helpers/getContracts')
const MatryxSubmission = require('../contracts/MatryxSubmission')

let userController = {}

userController.getData = (userAddress) => {
  const User = contracts.user
  return User.getData(userAddress)
}

userController.getTournaments = (userAddress) => {
  return User.getTournaments(userAddress)
}

userController.getSubmissionsForTournament = async (userAddress, tournamentAddress) => {
  const User = contracts.user
  const submissions = await User.getSubmissions(userAddress)

  const subsAndTourns = await Promise.all(
    submissions.map(async sAddress => {
      const submission = new MatryxSubmission(sAddress, abis.submission)
      const tAddress = await submission.getTournament()
      return { sAddress, tAddress }
    })
  )

  const subsForTourn = subsAndTourns
    .filter(sat => sat.tAddress === tournamentAddress)
    .map(sat => sat.sAddress)

  return subsForTourn
}

module.exports = userController
