const Contract = require('./Contract')
const utils = require('../helpers/utils')

module.exports = class MatryxSubmission extends Contract {
  // istanbul ignore next
  async getTournament() {
    return await this.contract.getTournament()
  }

  // istanbul ignore next
  async getRound() {
    return await this.contract.getRound()
  }

  // istanbul ignore next
  async isAccessible(address) {
    return await this.contract.isAccessible(address)
  }

  // istanbul ignore next
  async getAuthor() {
    return await this.contract.getAuthor()
  }

  async getData() {
    let [
      title,
      descriptionHash,
      fileHash,
      timeSubmitted,
      timeUpdated
    ] = await this.contract.getData()

    // parse data
    title = utils.bytesToString(title)
    descriptionHash = utils.bytesToString(descriptionHash)
    fileHash = utils.bytesToString(fileHash)
    timeSubmitted = +timeSubmitted * 1000
    timeUpdated = +timeUpdated * 1000

    return {
      title,
      descriptionHash,
      fileHash,
      timeSubmitted,
      timeUpdated
    }
  }

  async getTitle() {
    const title = await this.contract.getTitle()
    return utils.bytesToString(title)
  }

  // istanbul ignore next
  async getDescriptionHash() {
    const hash = await this.contract.getDescriptionHash()
    return utils.bytesToString(hash)
  }

  // istanbul ignore next
  async getFileHash() {
    const hash = await this.contract.getFileHash()
    return utils.bytesToString(hash)
  }

  async getReferences() {
    return await this.contract.getReferences()
  }

  async getContributors() {
    return await this.contract.getContributors()
  }

  async getTimeSubmitted() {
    const timeSubmitted = await this.contract.getTimeSubmitted()
    return +timeSubmitted * 1000
  }

  // istanbul ignore next
  async getTimeUpdated() {
    const timeUpdated = await this.contract.getTimeUpdated()
    return +timeUpdated * 1000
  }

  async getBalance() {
    const balance = await this.contract.getBalance()
    return utils.fromWei(balance)
  }

  async getTotalWinnings() {
    const totalWinnings = await this.contract.getTotalWinnings()
    return utils.fromWei(totalWinnings)
  }

  async getOwner() {
    return await this.contract.getOwner()
  }

  // istanbul ignore next
  async isOwner(address) {
    return await this.contract.isOwner(address)
  }
}
