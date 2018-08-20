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

describe('Submissions tests:', () => {
  describe('/submissions/', () => {
    let err, res
    before(done => {
      request.get('/submissions/').end((e, r) => {
        ;[err, res] = [e, r]
        done()
      })
    })

    it("doesn't error", () => {
      expect(err).to.be.null
      expect(res).to.have.status(200)
    })
  })

  describe('/submissions/address/:submissionAddress', () => {
    let err, res
    before(done => {
      request
        .get('/submissions/address/0x0000000000000000000000000000000000000000')
        .end((e, r) => {
          ;[err, res] = [e, r]
          done()
        })
    })

    it("doesn't error", () => {
      expect(err).to.be.null
      expect(res).to.have.status(200)
    })

    it('status 500 for invalid address', done => {
      request.get('/submissions/address/not-an-address').end((err, res) => {
        expect(res).to.have.status(500)
        done()
      })
    })

    it('returns submission details', () => {
      expect(res.body.submission).to.be.an('object')
    })

    it('matches submission details structure', () => {
      let submission = res.body.submission
      expect(submission.address).to.be.a('string')
      expect(submission.title).to.be.a('string')
      expect(submission.owner).to.be.a('string')
      expect(submission.reward).to.be.a('number')
      expect(submission.description).to.be.a('string')
      expect(submission.contributors).to.be.an('array')
      expect(submission.references).to.be.an('array')
      expect(submission.fileHash).to.be.a('string')
      expect(submission.timeSubmitted).to.be.a('number')
    })
  })

  describe('/submissions/address/:submissionAddress/owner', () => {
    let err, res
    before(done => {
      request
        .get('/submissions/address/0x0000000000000000000000000000000000000000/owner')
        .end((e, r) => {
          ;[err, res] = [e, r]
          done()
        })
    })

    it("doesn't error", () => {
      expect(err).to.be.null
      expect(res).to.have.status(200)
    })

    it('status 500 for invalid address', done => {
      request
        .get('/submissions/address/not-an-address/owner')
        .end((err, res) => {
          expect(res).to.have.status(500)
          done()
        })
    })

    it('returns owner', () => {
      expect(res.body.owner).to.be.a('string')
    })
  })
})
