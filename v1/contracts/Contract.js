/**
 * Contract.js
 * Contract base class for ethers Contract abstraction classes
 *
 * Authors dev@nanome.ai
 * Copyright (c) 2018, Nanome Inc
 * Licensed under ISC. See LICENSE.md in project root.
 */

const ethers = require('ethers')

const provider = new ethers.providers.JsonRpcProvider(process.env.LOCAL_HOST_RPC)
// const provider = new ethers.providers.InfuraProvider('ropsten', 'metamask')

module.exports = class Contract {
  // Contract constructor uses "setup" so that in testing,
  // can easily replace ethers.Contract with mocktract
  constructor() {
    this.setup(...arguments)
  }

  // istanbul ignore next
  setup(address, abi) {
    this.contract = new ethers.Contract(address, abi, provider)
  }
}
