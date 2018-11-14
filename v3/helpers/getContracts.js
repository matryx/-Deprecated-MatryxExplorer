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

abis.on('update', e => {
  const { platform, system } = e
  contracts.system = new MatryxSystem(system.address, system.abi)
  contracts.platform = new MatryxPlatform(platform.address, platform.abi)
})

const contracts = {
  system: null,
  platform: null
}

module.exports = contracts
