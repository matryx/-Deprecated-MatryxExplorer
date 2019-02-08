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
})
