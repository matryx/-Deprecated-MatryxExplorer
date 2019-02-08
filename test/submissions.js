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
})
