/**
 * getContracts.js
 * Helper file for getting current contracts for use throughout the app
 *
 * Authors dev@nanome.ai
 * Copyright (c) 2018, Nanome Inc
 * Licensed under ISC. See LICENSE.md in project root
 */

const abis = require('./getAbis')
const MatryxSystem = require('../contracts/MatryxSystem')
const MatryxPlatform = require('../contracts/MatryxPlatform')
const MatryxCommit = require('../contracts/MatryxCommit')
const MatryxUser = require('../contracts/MatryxUser')

abis.on('update', e => {
  const { system, user, platform, commit } = e
  contracts.system = new MatryxSystem(system.address, system.abi)
  contracts.user = new MatryxUser(user.address, user.abi)
  contracts.platform = new MatryxPlatform(platform.address, platform.abi)
  contracts.commit = new MatryxCommit(commit.address, commit.abi)
})

const contracts = {
  system: null,
  user: null,
  platform: null,
  commit: null
}

module.exports = contracts
