const ethers = require('ethers')

// const provider = new ethers.providers.JsonRpcProvider(process.env.LOCAL_HOST_RPC)
const provider = new ethers.providers.InfuraProvider('ropsten', 'metamask')

module.exports = class Contract {
  constructor(address, abi) {
    this.setup(address, abi)
  }

  setup(address, abi) {
    this.contract = new ethers.Contract(address, abi, provider)
  }
}
