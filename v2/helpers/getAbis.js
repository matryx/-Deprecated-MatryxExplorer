/**
 * getAbis.js
 * Helper file for getting current ABIs for use throughout the app
 *
 * Authors dev@nanome.ai
 * Copyright (c) 2018, Nanome Inc
 * Licensed under ISC. See LICENSE.md in project root
 */

const config = require('../../config')
const externalApiCalls = require('../controllers/gateway/externalApiCalls')

const version = config.PLATFORM_VERSION
const networkId = 3 // ropsten

const getAbis = {
  // update mutex
  updateInProgress: false,
  lastUpdate: null,
  platform: null,
  tournament: null,
  round: null,
  submission: null,

  async attemptUpdate() {
    const { updatedAt } = await externalApiCalls.getMigrationsInfo(version)
    if (this.lastUpdate === updatedAt || this.updateInProgress) return false

    await this.update()
    return true
  },

  async update() {
    this.updateInProgress = true

    const platformPromise = externalApiCalls
      .getMatryxPlatformInfo(version)
      .then(result => {
        let address = result['networks'][networkId]['address']
        let abi = result.abi
        return { address, abi }
      })

    const [
      platform,
      tournament,
      round,
      submission,
      { updatedAt }
    ] = await Promise.all([
      platformPromise,
      externalApiCalls.getMatryxTournamentAbi(version),
      externalApiCalls.getMatryxRoundAbi(version),
      externalApiCalls.getMatryxSubmissionAbi(version),
      externalApiCalls.getMigrationsInfo(version)
    ])

    abis = { platform, tournament, round, submission }
    Object.assign(this, abis)

    this.lastUpdate = updatedAt
    this.updateInProgress = false
  }
}

// TODO: error handling on initial app abi load
getAbis.loadedAbis = new Promise(async done => {
  await getAbis.update()
  done()
})

module.exports = getAbis
