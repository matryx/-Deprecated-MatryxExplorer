/**
 * MatryxPlatform.js
 * Class for parsing values from MatryxPlatform smart contract
 *
 * Authors dev@nanome.ai
 * Copyright (c) 2018, Nanome Inc
 * Licensed under ISC. See LICENSE.md in project root.
 */

const Contract = require('./Contract')
const utils = require('../helpers/utils')

// NOTE: all istanbul ignores are contract methods currently not being used
module.exports = class MatryxPlatform extends Contract {
  async getInfo() {
    return await this.contract.getInfo()
  }

  // Peer

  // istanbul ignore next
  async hasEnteredMatryx(address) {
    return await this.contract.hasEnteredMatryx(address)
  }

  // Tournament

  async getTournamentCount() {
    return +await this.contract.getTournamentCount()
  }

  async getTournaments(startIndex = 0, count = 0) {
    return await this.contract.getTournaments(startIndex, count)
  }

  // Category

  async getCategories(startIndex = 0, count = 0) {
    const categories = await this.contract.getCategories(startIndex, count)
    return categories.map(c => utils.bytesToString([c]))
  }

  async getTournamentsByCategory(category, startIndex = 0, count = 0) {
    let bytes = utils.stringToBytes(category)
    return await this.contract.getTournamentsByCategory(bytes, startIndex, count)
  }

  // User

  async getTournamentsByUser(address) {
    return await this.contract.getTournamentsByUser(address)
  }

  async getSubmissionsByUser(address) {
    return await this.contract.getSubmissionsByUser(address)
  }
}
