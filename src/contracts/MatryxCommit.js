/**
 * MatryxCommit.js
 * Class for parsing values from MatryxCommit smart contract
 *
 * Authors dev@nanome.ai
 * Copyright (c) 2018, Nanome Inc
 * Licensed under ISC. See LICENSE.md in project root.
 */

const Contract = require('./Contract')
const utils = require('../helpers/utils')

// NOTE: all istanbul ignores are contract methods currently not being used
module.exports = class MatryxCommit extends Contract {
  async getCommit(commitHash) {
    return await this.contract.getCommit(commitHash)
  }

  async getAllGroupNames() {
    const groupHashes = await this.contract.getAllGroups()
    const groupNameLookups = groupHashes.map(hash => this.contract.getGroupName(hash))
    const groupNames = await Promise.all(groupNameLookups)
    return groupNames
  }
}
