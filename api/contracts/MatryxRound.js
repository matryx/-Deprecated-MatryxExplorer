const Contract = require('./Contract')
const utils = require('../helpers/utils')

module.exports = class MatryxRound extends Contract {
  async submissionExists(address) {
    return await this.contract.submissionExists(address)
  }

  async getState() {
    let state = await this.contract.getState()
    if (state == 0) return 'notYetOpen'
    else if (state == 1) return 'notFunded'
    else if (state == 2) return 'isOpen'
    else if (state == 3) return 'inReview'
    else if (state == 4) return 'hasWinners'
    else if (state == 5) return 'isClosed'
    else if (state == 6) return 'isAbandoned'
    return 'isBroken' // should never be this
  }

  async getPlatform() {
    return await this.contract.getPlatform()
  }

  async getTournament() {
    return await this.contract.getTournament()
  }

  async getData() {
    let [
      startTime,
      endTime,
      reviewPeriodDuration,
      bounty,
      closed
    ] = await this.contract.getData()

    // parse data
    startTime = +startTime * 1000
    endTime = +endTime * 1000
    reviewPeriodDuration = +reviewPeriodDuration * 1000
    bounty = utils.fromWei(bounty)

    return {
      startTime,
      endTime,
      reviewPeriodDuration,
      bounty,
      closed
    }
  }

  async getStartTime() {
    const startTime = +await this.contract.getStartTime()
    return startTime * 1000
  }

  async getEndTime() {
    const endTime = +await this.contract.getEndTime()
    return endTime * 1000
  }

  async getReviewPeriodDuration() {
    const duration = +await this.contract.getReviewPeriodDuration()
    return duration * 1000
  }

  async getBounty() {
    const bounty = +await this.contract.getBounty()
    return utils.fromWei(bounty)
  }

  async getRemainingBounty() {
    const remainingBounty = +await this.contract.getRemainingBounty()
    return utils.fromWei(remainingBounty)
  }

  async getTokenAddress() {
    return await this.contract.getTokenAddress()
  }

  async getSubmissions() {
    return await this.contract.getSubmissions()
  }

  // note: this is used for getting submission balance
  async getBalance(address) {
    const balance = +await this.contract.getBalance(address)
    return utils.fromWei(balance)
  }

  async getRoundBalance() {
    const balance = +await this.contract.getRoundBalance()
    return utils.fromWei(balance)
  }

  async submissionsChosen() {
    return await this.contract.submissionsChosen()
  }

  async getWinningSubmissionAddresses() {
    return await this.contract.getWinningSubmissionAddresses()
  }

  async numberOfSubmissions() {
    return +await this.contract.numberOfSubmissions()
  }
}
