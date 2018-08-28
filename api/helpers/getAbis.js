/**
 * getAbis.js
 * Helper file for getting current ABIs for use throughout the app
 *
 * Authors dev@nanome.ai
 * Copyright (c) 2018, Nanome Inc
 * Licensed under ISC. See LICENSE.md in project root
 */

const externalApiCalls = require('../controllers/gateway/externalApiCalls')

const version = process.env.PLATFORM_VERSION
const networkId = process.env.NETWORK_ID

module.exports = new Promise(async (resolve, reject) => {
  const platformPromise = externalApiCalls
    .getMatryxPlatformInfo(version)
    .then(result => {
      let address = result['networks'][networkId]['address']
      let abi = result.abi
      return { address, abi }
    })
  const tournamentPromise = externalApiCalls.getMatryxTournamentAbi(version)
  const roundPromise = externalApiCalls.getMatryxRoundAbi(version)
  const submissionPromise = externalApiCalls.getMatryxSubmissionAbi(version)

  const [platform, tournament, round, submission] = await Promise.all([
    platformPromise,
    tournamentPromise,
    roundPromise,
    submissionPromise
  ])

  resolve({
    platform,
    tournament,
    round,
    submission
  })
})
