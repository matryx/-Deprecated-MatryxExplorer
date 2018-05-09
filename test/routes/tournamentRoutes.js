// External Imports
let chai = require('chai')
let chaiHttp = require('chai-http')
let should = chai.should()
let assert = require('assert')

// Internal Imports
let server = require('../../app')

// Setup
chai.use(chaiHttp)

// Mock the testingController

describe('General Application Testing/', function () {
  it('should give back that carl sagan quote', function (done) {
    chai.request(server)
    .get('/')
    .end(function (err, res) {
      res.should.have.status(200)
      // console.log(res)
      // TODO: Compare against the quote
      done()
    })
  })
})
