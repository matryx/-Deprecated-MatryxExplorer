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
module.exports = class MatryxSystem extends Contract {
  async getVersion() {
    return +await this.contract.getVersion()
  }

  async getAllVersions() {
    return await this.contract.getAllVersions()
  }

  async getContract(version, name) {
    const bytes = utils.stringToBytes(name)
    return await this.contract.getContract(version, bytes)
  }

  async getContractType(address) {
    const types = {
      0: 'Unknown',
      1: 'Platform',
      2: 'Tournament',
      3: 'Round',
      4: 'Submission'
    }
    const type = +await this.contract.getContractType(address)
    return types[type]
  }
}
