const ethers = require('ethers')
const utils = require('../helpers/utils')

const providerURL = process.env.CUSTOMRPC
const provider = new ethers.providers.JsonRpcProvider(providerURL)

module.exports = class MatryxTournament {
  constructor(address, abi) {
    this.contract = new ethers.Contract(address, abi, provider)
  }

  async getPlatform() {
    return await this.contract.getPlatform()
  }

  async getTokenAddress() {
    return await this.contract.getTokenAddress()
  }

  async isEntrant(address) {
    return await this.contract.isEntrant(address)
  }

  async isRound(address) {
    return await this.contract.isRound(address)
  }

  async getRounds() {
    return await this.contract.getRounds()
  }

  async getState() {
    let state = +await this.contract.getState()
    if (state == 0) return 'notYetOpen'
    else if (state == 1) return 'isOnHold'
    else if (state == 2) return 'isOpen'
    else if (state == 3) return 'isClosed'
    else if (state == 4) return 'isAbandoned'
    else return 'isBroken' // should never be this
  }

  async getData() {
    let [
      category,
      title,
      descriptionHash,
      fileHash,
      initialBounty,
      entryFee
    ] = await this.contract.getData()

    // parse data
    category = utils.bytesToString([category])
    title = utils.bytesToString(title)
    descriptionHash = utils.bytesToString(descriptionHash)
    fileHash = utils.bytesToString(fileHash)
    initialBounty = utils.fromWei(initialBounty)
    entryFee = utils.fromWei(entryFee)

    return {
      category,
      title,
      descriptionHash,
      fileHash,
      initialBounty,
      entryFee
    }
  }

  async currentRound() {
    let [id, address] = await this.contract.currentRound()
    id = +id
    return { id, address }
  }

  async getCategory() {
    const category = await this.contract.getCategory()
    return utils.bytesToString([category])
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

  async getBounty() {
    const bounty = await this.contract.getBounty()
    return utils.fromWei(bounty)
  }

  async getBalance() {
    const balance = await this.contract.getBalance()
    return utils.fromWei(balance)
  }

  async getEntryFee() {
    const fee = await this.contract.getEntryFee()
    return utils.fromWei(fee)
  }

  async submissionCount() {
    return +await this.contract.submissionCount()
  }

  async entrantCount() {
    return +await this.contract.entrantCount()
  }

  // Ownable

  async getOwner() {
    return await this.contract.getOwner()
  }

  async isOwner(address) {
    return await this.contract.isOwner(address)
  }
}
