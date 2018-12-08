describe('Rounds tests:', () => {
  describe('/rounds/', () => {
    let err, res
    before(done => {
      request.get('/v2/rounds/').end((e, r) => {
        ;[err, res] = [e, r]
        done()
      })
    })

    it("doesn't error", () => {
      expect(err).to.be.null
      expect(res).to.have.status(200)
    })
  })

  describe('/rounds/address/:roundAddress', () => {
    let err, res
    before(done => {
      request
        .get('/v2/rounds/address/0x0000000000000000000000000000000000000000')
        .end((e, r) => {
          ;[err, res] = [e, r]
          done()
        })
    })

    it("doesn't error", () => {
      expect(err).to.be.null
      expect(res).to.have.status(200)
    })

    it('status 500 for invalid address', done => {
      request.get('/v2/rounds/address/not-an-address').end((err, res) => {
        expect(res).to.have.status(500)
        done()
      })
    })

    it('returns round details', () => {
      expect(res.body.round).to.be.an('object')
    })

    it('matches round details structure', () => {
      let round = res.body.round
      expect(round.tournamentAddress).to.be.a('string')
      expect(round.tournamentTitle).to.be.a('string')
      expect(round.tournamentDescription).to.be.a('string')
      expect(round.start).to.be.a('number')
      expect(round.end).to.be.a('number')
      expect(round.reviewPeriodDuration).to.be.a('number')
      expect(round.bounty).to.be.a('number')
      expect(round.closed).to.be.a('boolean')
      expect(round.roundStatus).to.be.a('string')
      expect(round.submissions).to.be.an('array')
    })
  })
})
