const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../server')

chai.use(chaiHttp)
global.request = chai.request(server).keepOpen()

global.expect = chai.expect

const Contract = require('../api/contracts/Contract')
const mocktract = require('./mocktract')
Contract.prototype.setup = function(address, abi, contract) {
  this.contract = mocktract(address, abi)

  // MatryxRound mock state "isClosed" for full coverage
  if (contract === 'MatryxRound') {
    this.contract.getState.mockReturnValue(5)
  }
}

// stub getIpfsFile for descriptions
const ipfsCalls = require('../api/controllers/gateway/ipfsCalls')
ipfsCalls.getIpfsFile = () => 'ipfs data'
