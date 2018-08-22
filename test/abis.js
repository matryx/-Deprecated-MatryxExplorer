// Require the dev-dependencies
let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('../server')
let expect = chai.expect
let assert = require('assert')

let Contract = require('../api/contracts/Contract')
let mocktract = require('./mocktract')
Contract.prototype.setup = function(address, abi) {
  this.contract = mocktract(address, abi)
}

const networkID = process.env.NETWORK_ID

// way to mock fetch through fetch's internal Promise
const fetch = require('node-fetch')
fetch.Promise = function () {
  return Promise.resolve({
    json: () => ({
      abi: 'abi',
      networks: {
        [networkID]: {
          address: 'address'
        }
      }
    })
  })
}

chai.use(chaiHttp)
const request = chai.request(server).keepOpen()

describe('ABI tests:', () => {
  let routes = [
    { base: '/platform/', routes: ['getInfo', 'getAddress', 'getAbi'] },
    { base: '/token/', routes: ['getInfo', 'getAddress', 'getAbi'] },
    { base: '/tournaments/', routes: ['getAbi'] },
    { base: '/submissions/', routes: ['getAbi'] },
    { base: '/rounds/', routes: ['getAbi'] }
  ]

  for (const route of routes) {
    for (const subroute of route.routes) {
      const path = route.base + subroute
      describe(path, () => {
        let err, res
        before(done => {
          request.get(path).end((e, r) => {
            ;[err, res] = [e, r]
            done()
          })
        })

        it("doesn't error", () => {
          expect(err).to.be.null
          expect(res).to.have.status(200)
        })

        it('has correct data', () => {
          switch (subroute) {
            case 'getInfo':
              expect(res.body.address).to.equal('address')
              expect(res.body.abi).to.equal('abi')
              break
            case 'getAddress':
              expect(res.body.address).to.equal('address')
              break
            case 'getAbi':
              expect(res.body.abi).to.equal('abi')
              break
          }
        })
      })
    }
  }
})
