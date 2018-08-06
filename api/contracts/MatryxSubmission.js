const ethers = require('ethers')
const utils = require('../helpers/utils')

const providerURL = process.env.CUSTOMRPC
const provider = new ethers.providers.JsonRpcProvider(providerURL)

module.exports = class MatryxSubmission {
  constructor(address, abi) {
    this.contract = new ethers.Contract(address, abi, provider)
  }

  async getTournament() {
    return await this.contract.getTournament()
  }

  async getRound() {
    return await this.contract.getRound()
  }

  async isAccessible(address) {
    return await this.contract.isAccessible(address)
  }

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

  async getDescriptionHash() {
    const hash = await this.contract.getDescriptionHash()
    return utils.bytesToString(hash)
  }

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

  async getTimeUpdated() {
    const timeUpdated = await this.contract.getTimeUpdated()
    return +timeUpdated * 1000
  }

  async getBalance() {
    const balance = await this.contract.getBalance()
    return utils.fromWei(balance)
  }

  async getOwner() {
    return await this.contract.getOwner()
  }

  async isOwner(address) {
    return await this.contract.isOwner(address)
  }
}
