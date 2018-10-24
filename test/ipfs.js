describe('IPFS tests:', () => {
  describe('/ipfs/', () => {
    it("doesn't error", done => {
      request.get('/v2/ipfs/').end((err, res) => {
        expect(err).to.be.null
        expect(res).to.have.status(200)
        done()
      })
    })
  })

  describe('/ipfs/upload/', () => {
    it('upload should work', done => {
      request
        .post('/ipfs/upload')
        .field('description', 'test')
        .field('jsonContent', '{"json":"test"}')
        .attach('filesContent', './.env', '.env')
        .end((err, res) => {
          expect(res.body.descriptionHash).to.equal('ipfs hash')
          expect(res.body.folderHash).to.equal('ipfs hash')
          done()
        })
    })
  })
})
