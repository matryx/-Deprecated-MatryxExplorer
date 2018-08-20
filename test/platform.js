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

chai.use(chaiHttp)
const request = chai.request(server).keepOpen()

describe('Platform tests:', () => {
  describe('/platform/', () => {
    let err, res
    before(done => {
      request.get('/platform/').end((e, r) => {
        ;[err, res] = [e, r]
        done()
      })
    })

    it("doesn't error", () => {
      expect(err).to.be.null
      expect(res).to.have.status(200)
    })
  })

  describe('/platform/getAllCategories', () => {
    let err, res
    before(done => {
      request
        .get('/platform/getAllCategories')
        .end((e, r) => {
          ;[err, res] = [e, r]
          done()
        })
    })

    it("doesn't error", () => {
      expect(err).to.be.null
      expect(res).to.have.status(200)
    })

    it('returns categories', () => {
      expect(res.body.categories).to.be.an('array')
    })
  })
})
