const ethers = require('ethers')

// const providerURL = process.env.CUSTOMRPC
// const provider = new ethers.providers.JsonRpcProvider(providerURL)
const provider = new ethers.providers.InfuraProvider('ropsten', 'metamask')

module.exports = class Contract {
  constructor(address, abi) {
    this.contract = new ethers.Contract(address, abi, provider)
  }
}
