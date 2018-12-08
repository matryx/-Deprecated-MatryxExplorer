/**
 * MatryxUser.js
 * Class for parsing values from MatryxUser smart contract
 *
 * Authors dev@nanome.ai
 * Copyright (c) 2018, Nanome Inc
 * Licensed under ISC. See LICENSE.md in project root.
 */

const Contract = require('./Contract')
const utils = require('../helpers/utils')

// NOTE: all istanbul ignores are contract methods currently not being used
module.exports = class MatryxUser extends Contract {
  async getData(address) {
    const data = await this.contract.getData(address)
    const response = {}

    response.timeEntered = +data.timeEntered * 1000
    response.positiveVotes = +data.positiveVotes
    response.negativeVotes = +data.negativeVotes
    response.totalSpent = utils.fromWei(data.totalSpent)
    response.totalWinnings = utils.fromWei(data.totalWinnings)
    response.tournaments = data.tournaments
    response.tournamentsEntered = data.tournamentsEntered
    response.submissions = data.submissions
    response.contributedTo = data.contributedTo
    response.unlockedFiles = data.unlockedFiles

    return response
  }

  async getTournaments(address) {
    return await this.contract.getTournaments(address)
  }

  async getSubmissions(address) {
    return await this.contract.getSubmissions(address)
  }
}
