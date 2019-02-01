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
  async isEntrant(address) {
    return await this.contract.isEntrant(address)
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

  async getDetails() {
    let {
      title,
      descHash,
      fileHash,
      bounty,
      entryFee
    } = await this.contract.getDetails()

    // parse data
    title = utils.bytesToString(title)
    descHash = utils.bytesToString(descHash)
    fileHash = utils.bytesToString(fileHash)
    bounty = utils.fromWei(bounty)
    entryFee = utils.fromWei(entryFee)

    return {
      title,
      // category, // TODO categories in db
      descHash,
      fileHash,
      bounty,
      entryFee
    }
  }

  async getCurrentRound() {
    let [id, address] = await this.contract.getCurrentRound()
    id = +id
    return { id, address }
  }

  async getOwner() {
    return await this.contract.getOwner()
  }

  async getTitle() {
    const title = await this.contract.getTitle()
    return utils.bytesToString(title)
  }

  // istanbul ignore next
  async getCategory() {
    const category = await this.contract.getCategory()
    return utils.bytesToString([category])
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
  async getSubmissionCount() {
    return +await this.contract.getSubmissionCount()
  }

  async getEntrantCount() {
    return +await this.contract.getEntrantCount()
  }
}
