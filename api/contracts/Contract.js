const ethers = require('ethers')

// const provider = new ethers.providers.JsonRpcProvider(process.env.LOCAL_HOST_RPC)
const provider = new ethers.providers.InfuraProvider('ropsten', 'metamask')

module.exports = class Contract {
  constructor() {
    this.setup(...arguments)
  }

  // istanbul ignore next
  setup(address, abi) {
    this.contract = new ethers.Contract(address, abi, provider)
  }
}
