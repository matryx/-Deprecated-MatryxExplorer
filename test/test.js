let mongoose = require('mongoose')
// let TournamentRoute = require('../api/routes/tournaments')

// Require the dev-dependencies
let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('../server')
let should = chai.should()
let assert = require('assert')
let Web3 = require('web3')

let web3 = new Web3()

chai.use(chaiHttp)

describe('TournamentRoute tests:', function () {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal([1, 2, 3].indexOf(4), -1)
    })
  })

  // describe('/testCase', () => {
  //   it('it should GET the test endpoint', (done) => {
  //     chai.request(server)
  //             .get('/testCase')
  //             .end((err, res) => {
  //               res.should.have.status(200)
  //               console.log(res.body)
  //                 // res.body.should.be.a('array');
  //                 // res.body.length.should.be.eql(0);
  //               done()
  //             })
  //   })
  // })
})
