const Contract = require('./Contract')
const utils = require('../helpers/utils')

module.exports = class MatryxPlatform extends Contract {
  // istanbul ignore next
  async getTokenAddress() {
    return await this.contract.getTokenAddress()
  }

  // Peer

  // istanbul ignore next
  async hasPeer(address) {
    return await this.contract.hasPeer(address)
  }

  // istanbul ignore next
  async isPeer(address) {
    return await this.contract.isPeer(address)
  }

  // istanbul ignore next
  async peerAddress(address) {
    return await this.contract.peerAddress(address)
  }

  // istanbul ignore next
  async peerExistsAndOwnsSubmission(peerAddress, submissionAddress) {
    return await this.contract.peerExistsAndOwnsSubmission(peerAddress, submissionAddress)
  }

  // Tournament

  async getTournamentCount() {
    return +await this.contract.tournamentCount()
  }

  // istanbul ignore next
  async getTournament(index) {
    return await this.contract.allTournaments(index)
  }

  async getTournaments() {
    return await this.contract.getTournaments()
  }

  // Category

  // istanbul ignore next
  async getCategoryCount(category) {
    let bytes = utils.stringToBytes(category)
    return +await this.contract.getCategoryCount(bytes)
  }

  async getTournamentsByCategory(category) {
    let bytes = utils.stringToBytes(category)
    return await this.contract.getTournamentsByCategory(bytes)
  }

  // // TODO: Platform doens't have getTopCategory anymore
  // async getTopCategories() {
  //   let categories = []
  //   for (i = 0; i < 10; i++) {
  //     let category = this.contract.getTopCategory(i)
  //     categories.push(category)
  //   }
  //   return await Promise.all(categories)
  // }

  async getAllCategories() {
    let [count, categories] = await this.contract.getAllCategories()
    categories = categories.map(cat => utils.bytesToString([cat]))
    return categories
  }
}
