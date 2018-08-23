const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../server')

chai.use(chaiHttp)
global.request = chai.request(server).keepOpen()

global.expect = chai.expect

const Contract = require('../api/contracts/Contract')
const mocktract = require('./mocktract')
Contract.prototype.setup = function(address, abi) {
  this.contract = mocktract(address, abi)
}

// stub getIpfsFile for descriptions
const ipfsCalls = require('../api/controllers/gateway/ipfsCalls')
ipfsCalls.getIpfsFile = () => 'ipfs data'
