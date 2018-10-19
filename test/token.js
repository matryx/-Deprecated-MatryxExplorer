describe('Token tests:', () => {
  describe('/token/', () => {
    it("doesn't error", done => {
      request.get('/token/').end((err, res) => {
        expect(err).to.be.null
        expect(res).to.have.status(200)
        done()
      })
    })
  })
})
