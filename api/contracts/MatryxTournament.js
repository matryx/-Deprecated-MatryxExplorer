/**
 * MatryxTournament.js
 * Class for parsing values from MatryxTournament smart contract
 *
 * Authors dev@nanome.ai
 * Copyright (c) 2018, Nanome Inc
 * Licensed under ISC. See LICENSE.md in project root.
 */

const Contract = require('./Contract')
const utils = require('../helpers/utils')

// NOTE: all istanbul ignores are contract methods currently not being used
module.exports = class MatryxTournament extends Contract {
  // istanbul ignore next
  async getPlatform() {
    return await this.contract.getPlatform()
  }

  // istanbul ignore next
  async getTokenAddress() {
    return await this.contract.getTokenAddress()
  }

  async isEntrant(address) {
    return await this.contract.isEntrant(address)
  }

  // istanbul ignore next
  async isRound(address) {
    return await this.contract.isRound(address)
  }

  async getRounds() {
    return await this.contract.getRounds()
  }

  async getState() {
    const states = {
      0: 'notYetOpen',
      1: 'isOnHold',
      2: 'isOpen',
      3: 'isClosed',
      4: 'isAbandoned'
    }
    const state = +await this.contract.getState()
    // istanbul ignore next
    return states[state] || 'isBroken'
  }

  async getData() {
    let {
      category,
      title,
      descriptionHash,
      fileHash,
      initialBounty,
      entryFee
    } = await this.contract.getData()

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

  // istanbul ignore next
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

  // istanbul ignore next
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

  // istanbul ignore next
  async getEntryFee() {
    const fee = await this.contract.getEntryFee()
    return utils.fromWei(fee)
  }

  // istanbul ignore next
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

  // istanbul ignore next
  async isOwner(address) {
    return await this.contract.isOwner(address)
  }
}
