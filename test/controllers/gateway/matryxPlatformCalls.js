let mongoose = require('mongoose')

// Require the dev-dependencies
let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('../../../server')
let should = chai.should()
let assert = require('assert')

const sinon = require('sinon')

chai.use(chaiHttp)

// Setup and config
let matryxPlatformCalls = require('../../../api/controllers/gateway/matryxPlatformCalls')
matryxPlatformCalls.matryxPlatformContract = {}

describe('MatryxPlatformCalls Tests:', function () {
  describe('getTournamentCount()', function () {
    it('should return the number of tournaments on the platform', function () {
      // Setup
      // TODO: spoof the matryxPlatformContract

      // Logic
      matryxPlatformCalls.getTournamentCount(function (count) {
        if (count) {
          assert.equal(count, 11)
        } else {
          assert.equal(1, 0)
        }
      })
    })
  })

  describe('tournaments/', function () {
    it('Should return all tournaments', function () {
      assert.equal([1, 2, 3].indexOf(4), -1)
    })
  })
})
