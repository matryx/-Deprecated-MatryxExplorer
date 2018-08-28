/**
 * MatryxRound.js
 * Class for parsing values from MatryxRound smart contract
 *
 * Authors dev@nanome.ai
 * Copyright (c) 2018, Nanome Inc
 * Licensed under ISC. See LICENSE.md in project root.
 */

const Contract = require('./Contract')
const utils = require('../helpers/utils')

module.exports = class MatryxRound extends Contract {
  constructor() {
    super(...arguments, 'MatryxRound')
  }

  // istanbul ignore next
  async submissionExists(address) {
    return await this.contract.submissionExists(address)
  }

  async getState() {
    const states = {
      0: 'notYetOpen',
      1: 'notFunded',
      2: 'isOpen',
      3: 'inReview',
      4: 'hasWinners',
      5: 'isClosed',
      6: 'isAbandoned'
    }
    const state = +await this.contract.getState()
    // istanbul ignore next
    return states[state] || 'isBroken'
  }

  // istanbul ignore next
  async getPlatform() {
    return await this.contract.getPlatform()
  }

  async getTournament() {
    return await this.contract.getTournament()
  }

  async getData() {
    let {
      start,
      end,
      reviewPeriodDuration,
      bounty,
      closed
    } = await this.contract.getData()

    // parse data
    start = +start * 1000
    end = +end * 1000
    reviewPeriodDuration = +reviewPeriodDuration * 1000
    bounty = utils.fromWei(bounty)

    return {
      start,
      end,
      reviewPeriodDuration,
      bounty,
      closed
    }
  }

  // istanbul ignore next
  async getStartTime() {
    const start = +await this.contract.getStartTime()
    return start * 1000
  }

  async getEndTime() {
    const end = +await this.contract.getEndTime()
    return end * 1000
  }

  // istanbul ignore next
  async getReviewPeriodDuration() {
    const duration = +await this.contract.getReviewPeriodDuration()
    return duration * 1000
  }

  // istanbul ignore next
  async getBounty() {
    const bounty = +await this.contract.getBounty()
    return utils.fromWei(bounty)
  }

  // istanbul ignore next
  async getRemainingBounty() {
    const remainingBounty = +await this.contract.getRemainingBounty()
    return utils.fromWei(remainingBounty)
  }

  // istanbul ignore next
  async getTokenAddress() {
    return await this.contract.getTokenAddress()
  }

  async getSubmissions() {
    return await this.contract.getSubmissions()
  }

  // note: this is used for getting submission balance
  // istanbul ignore next
  async getBalance(address) {
    const balance = +await this.contract.getBalance(address)
    return utils.fromWei(balance)
  }

  // istanbul ignore next
  async getRoundBalance() {
    const balance = +await this.contract.getRoundBalance()
    return utils.fromWei(balance)
  }

  // istanbul ignore next
  async submissionsChosen() {
    return await this.contract.submissionsChosen()
  }

  async getWinningSubmissionAddresses() {
    return await this.contract.getWinningSubmissionAddresses()
  }

  // istanbul ignore next
  async numberOfSubmissions() {
    return +await this.contract.numberOfSubmissions()
  }
}
