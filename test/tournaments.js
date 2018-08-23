describe('Tournaments tests:', () => {
  describe('/tournaments/', () => {
    let err, res
    before(done => {
      request.get('/tournaments/').end((e, r) => {
        ;[err, res] = [e, r]
        done()
      })
    })

    it("doesn't error", () => {
      expect(err).to.be.null
      expect(res).to.have.status(200)
    })

    it('returns tournaments array', () => {
      expect(res.body.tournaments).to.be.an('array')
    })

    it('item in array matches tournament structure', () => {
      let tournament = res.body.tournaments[0]
      expect(tournament).to.be.an('object')
      expect(tournament.address).to.be.a('string')
      expect(tournament.owner).to.be.a('string')
      expect(tournament.title).to.be.a('string')
      expect(tournament.description).to.be.a('string')
      expect(tournament.fileHash).to.be.a('string')
      expect(tournament.category).to.be.a('string')
      expect(tournament.state).to.be.a('string')
      expect(tournament.bounty).to.be.a('number')
      expect(tournament.ipType).to.be.a('string')
      expect(tournament.currentRound).to.be.a('number')
      expect(tournament.numberOfParticipants).to.be.a('number')
    })
  })

  describe('/tournaments/count', () => {
    let err, res
    before(done => {
      request.get('/tournaments/count/').end((e, r) => {
        ;[err, res] = [e, r]
        done()
      })
    })

    it("doesn't error", () => {
      expect(err).to.be.null
      expect(res).to.have.status(200)
    })

    it('returns count', () => {
      expect(res.body.count).to.exist
    })
  })

  describe('/tournaments/address/:tournamentAddress', () => {
    let err, res
    before(done => {
      request
        .get('/tournaments/address/0x0000000000000000000000000000000000000000')
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
      request.get('/tournaments/address/not-an-address').end((err, res) => {
        expect(res).to.have.status(500)
        done()
      })
    })

    it('returns tournament details', () => {
      expect(res.body.tournament).to.be.an('object')
    })

    it('matches tournament details structure', () => {
      let tournament = res.body.tournament
      expect(tournament.address).to.be.a('string')
      expect(tournament.owner).to.be.a('string')
      expect(tournament.title).to.be.a('string')
      expect(tournament.description).to.be.a('string')
      expect(tournament.fileHash).to.be.a('string')
      expect(tournament.category).to.be.a('string')
      expect(tournament.ipType).to.be.a('string')
      expect(tournament.state).to.be.a('string')
      expect(tournament.bounty).to.be.a('number')
      expect(tournament.remainingMtx).to.be.a('number')
      expect(tournament.currentRound).to.be.a('number')
      expect(tournament.currentRoundAddress).to.be.a('string')
      expect(tournament.currentRoundState).to.be.a('string')
      expect(tournament.roundEndTime).to.be.a('number')
      expect(tournament.numberOfParticipants).to.be.a('number')
      expect(tournament.entryFee).to.be.a('number')
    })
  })

  describe('/tournaments/address/:tournamentAddress/owner', () => {
    let err, res
    before(done => {
      request
        .get('/tournaments/address/0x0000000000000000000000000000000000000000/owner')
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
      request
        .get('/tournaments/address/not-an-address/owner')
        .end((err, res) => {
          expect(res).to.have.status(500)
          done()
        })
    })

    it('returns owner', () => {
      expect(res.body.owner).to.be.a('string')
    })
  })

  describe('/tournaments/address/:tournamentAddress/submissionCount', () => {
    let err, res
    before(done => {
      request
        .get('/tournaments/address/0x0000000000000000000000000000000000000000/submissionCount')
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
      request
        .get('/tournaments/address/not-an-address/submissionCount')
        .end((err, res) => {
          expect(res).to.have.status(500)
          done()
        })
    })

    it('returns submissionCount', () => {
      expect(res.body.submissionCount).to.be.a('number')
    })
  })

  describe('/tournaments/address/:tournamentAddress/currentRound', () => {
    let err, res
    before(done => {
      request
        .get('/tournaments/address/0x0000000000000000000000000000000000000000/currentRound')
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
      request
        .get('/tournaments/address/not-an-address/currentRound')
        .end((err, res) => {
          expect(res).to.have.status(500)
          done()
        })
    })

    it('returns currentRound', () => {
      expect(res.body.currentRound).to.be.a('number')
    })
  })

  describe('/tournaments/address/:tournamentAddress/round/:roundId', () => {
    let err, res
    before(done => {
      request
        .get('/tournaments/address/0x0000000000000000000000000000000000000000/round/1')
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
      request
        .get('/tournaments/address/not-an-address/round/1')
        .end((err, res) => {
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

  describe('/tournaments/address/:tournamentAddress/isEntrant/:address', () => {
    let err, res
    before(done => {
      request
        .get('/tournaments/address/0x0000000000000000000000000000000000000000/isEntrant/0x0000000000000000000000000000000000000000')
        .end((e, r) => {
          ;[err, res] = [e, r]
          done()
        })
    })

    it("doesn't error", () => {
      expect(err).to.be.null
      expect(res).to.have.status(200)
    })

    it('status 500 for invalid tournament address', done => {
      request
        .get('/tournaments/address/not-an-address/isEntrant/0x0000000000000000000000000000000000000000')
        .end((err, res) => {
          expect(res).to.have.status(500)
          done()
        })
    })

    it('status 500 for invalid entrant address', done => {
      request
        .get('/tournaments/address/0x0000000000000000000000000000000000000000/isEntrant/not-an-address')
        .end((err, res) => {
          expect(res).to.have.status(500)
          done()
        })
    })

    it('returns isEntrant', () => {
      expect(res.body.isEntrant).to.be.a('boolean')
    })
  })

  describe('/tournaments/address/:tournamentAddress/rounds', () => {
    let err, res
    before(done => {
      request
        .get('/tournaments/address/0x0000000000000000000000000000000000000000/rounds')
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
      request
        .get('/tournaments/address/not-an-address/rounds')
        .end((err, res) => {
          expect(res).to.have.status(500)
          done()
        })
    })

    it('returns rounds', () => {
      expect(res.body.rounds).to.be.an('array')
    })
  })

  describe('/tournaments/category/:category', () => {
    let err, res
    before(done => {
      request
        .get('/tournaments/category/math')
        .end((e, r) => {
          ;[err, res] = [e, r]
          done()
        })
    })

    it("doesn't error", () => {
      expect(err).to.be.null
      expect(res).to.have.status(200)
    })

    it('returns tournaments', () => {
      expect(res.body.tournaments).to.be.an('array')
    })
  })
})
