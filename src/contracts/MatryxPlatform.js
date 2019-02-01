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

  async isTournament(address) {
    return await this.contract.isTournament(address)
  }

  async isRound(address) {
    return await this.contract.isRound(address)
  }

  async isSubmission(address) {
    return await this.contract.isSubmission(address)
  }

  // Tournament

  async getTournamentCount() {
    return +await this.contract.getTournamentCount()
  }

  async getTournaments() {
    return await this.contract.getTournaments()
  }

  // User

  async getTournamentsByUser(address) {
    return await this.contract.getTournamentsByUser(address)
  }
}
