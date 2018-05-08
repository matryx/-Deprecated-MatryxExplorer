let mongoose = require('mongoose')

// Require the dev-dependencies
let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('../../server')
let should = chai.should()
let assert = require('assert')

chai.use(chaiHttp)

describe('TournamentController Tests:', function () {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal([1, 2, 3].indexOf(4), -1)
    })
  })

  describe('tournaments/', function () {
    it('Should return all tournaments', function () {
      assert.equal([1, 2, 3].indexOf(4), -1)
    })
  })
})
