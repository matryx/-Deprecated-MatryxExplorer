const Contract = require('./Contract')
const utils = require('../helpers/utils')

module.exports = class MatryxPlatform extends Contract {
  async getTokenAddress() {
    return await this.contract.getTokenAddress()
  }

  // Peer

  async hasPeer(address) {
    return await this.contract.hasPeer(address)
  }

  async isPeer(address) {
    return await this.contract.isPeer(address)
  }

  async peerAddress(address) {
    return await this.contract.peerAddress(address)
  }

  async peerExistsAndOwnsSubmission(peerAddress, submissionAddress) {
    return await this.contract.peerExistsAndOwnsSubmission(peerAddress, submissionAddress)
  }

  // Tournament

  async getTournamentCount() {
    return +await this.contract.tournamentCount()
  }

  async getTournament(index) {
    return await this.contract.allTournaments(index)
  }

  async getTournaments() {
    return await this.contract.getTournaments()
  }

  // Category

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
