// External Imports
let chai = require('chai')
let chaiHttp = require('chai-http')
let should = chai.should()
let assert = require('assert')

// Internal Imports
let server = require('../app')

// Setup
chai.use(chaiHttp)

// Mock Web 3
describe('General Application Testing', function () {
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

/*
EXPERIMENTAL
*/
  //
  // it('should add a SINGLE blob on /blobs POST', function(done) {
  //   chai.request(server)
  //     .post('/blobs')
  //     .send({'name': 'Java', 'lastName': 'Script'})
  //     .end(function(err, res){
  //       res.should.have.status(200);
  //       res.should.be.json;
  //       res.body.should.be.a('object');
  //       res.body.should.have.property('SUCCESS');
  //       res.body.SUCCESS.should.be.a('object');
  //       res.body.SUCCESS.should.have.property('name');
  //       res.body.SUCCESS.should.have.property('lastName');
  //       res.body.SUCCESS.should.have.property('_id');
  //       res.body.SUCCESS.name.should.equal('Java');
  //       res.body.SUCCESS.lastName.should.equal('Script');
  //       done();
  //     });
  // });
