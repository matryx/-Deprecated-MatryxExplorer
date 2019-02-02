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

// NOTE: all istanbul ignores are contract methods currently not being used
module.exports = class MatryxRound extends Contract {
  constructor() {
    super(...arguments, 'MatryxRound')
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
    const state = +(await this.contract.getState())
    // istanbul ignore next
    return states[state] || 'isBroken'
  }

  async getTournament() {
    return await this.contract.getTournament()
  }

  async getData() {
    const { info, details } = await this.contract.getData()
    let { tournament, allSubmissions, winners, closed } = info
    let { start, end, review, bounty } = details

    // parse data
    start = +start * 1000
    end = +end * 1000
    review = +review * 1000
    bounty = utils.fromWei(bounty)

    winners = winners.submissions

    return {
      tournament,
      submissions: allSubmissions,
      winners,
      start,
      end,
      review,
      bounty,
      closed
    }
  }

  // istanbul ignore next
  async getStart() {
    const start = +(await this.contract.getStart())
    return start * 1000
  }

  async getEnd() {
    const end = +(await this.contract.getEnd())
    return end * 1000
  }

  // istanbul ignore next
  async getReview() {
    const duration = +(await this.contract.getReview())
    return duration * 1000
  }

  // istanbul ignore next
  async getBounty() {
    const bounty = +(await this.contract.getBounty())
    return utils.fromWei(bounty)
  }

  // istanbul ignore next
  async getBalance() {
    const remainingBounty = +(await this.contract.getBalance())
    return utils.fromWei(remainingBounty)
  }

  async getSubmission(sHash) {
    const submission = await this.contract.getSubmission(sHash)
    let { title, descHash, timeSubmitted, reward } = submission

    title = utils.bytesToString(title)
    descHash = utils.bytesToString(descHash)
    reward = utils.fromWei(reward)
    timeSubmitted = +timeSubmitted * 1000

    return { title, descHash, timeSubmitted, reward }
  }

  async getSubmissions() {
    return await this.contract.getSubmissions()
  }

  async getSubmissionCount() {
    return +(await this.contract.getSubmissionCount())
  }

  async getWinningSubmissions() {
    return await this.contract.getWinningSubmissions()
  }
}
