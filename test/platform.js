describe('Platform tests:', () => {
  describe('/platform/', () => {
    let err, res
    before(done => {
      request.get('/v2/platform/').end((e, r) => {
        ;[err, res] = [e, r]
        done()
      })
    })

    it("doesn't error", () => {
      expect(err).to.be.null
      expect(res).to.have.status(200)
    })
  })

  describe('/platform/getAllCategories', () => {
    let err, res
    before(done => {
      request
        .get('/v2/platform/getAllCategories')
        .end((e, r) => {
          ;[err, res] = [e, r]
          done()
        })
    })

    it("doesn't error", () => {
      expect(err).to.be.null
      expect(res).to.have.status(200)
    })

    it('returns categories', () => {
      expect(res.body.categories).to.be.an('array')
    })
  })
})
