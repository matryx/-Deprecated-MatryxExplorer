describe('Base Route tests:', () => {
  describe('/', () => {
    it("doesn't error", done => {
      request.get('/').end((err, res) => {
        expect(err).to.be.null
        expect(res).to.have.status(200)
        done()
      })
    })
  })

  describe('/404', () => {
    let err, res
    before(done => {
      request
        .get('/404')
        .end((e, r) => {
          ;[err, res] = [e, r]
          done()
        })
    })

    it("returns 404 for unknown page", () => {
      expect(err).to.be.null
      expect(res).to.have.status(404)
    })

    it('returns error message', () => {
      expect(res.body.error).to.be.an('object')
      expect(res.body.error.message).to.be.a('string')
    })
  })
})
