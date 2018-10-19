describe('ABI tests:', () => {
  let routes = [
    { base: '/platform/', routes: ['getInfo', 'getAddress', 'getAbi'] },
    { base: '/token/', routes: ['getInfo', 'getAddress', 'getAbi'] },
    { base: '/tournaments/', routes: ['getAbi'] },
    { base: '/submissions/', routes: ['getAbi'] },
    { base: '/rounds/', routes: ['getAbi'] }
  ]

  for (const route of routes) {
    for (const subroute of route.routes) {
      const path = route.base + subroute
      describe(path, () => {
        let err, res
        before(done => {
          request.get(`${path}/valid-branch`).end((e, r) => {
            ;[err, res] = [e, r]
            done()
          })
        })

        it("doesn't error", () => {
          expect(err).to.be.null
          expect(res).to.have.status(200)
        })

        it('has correct data', () => {
          switch (subroute) {
            case 'getInfo':
              expect(res.body.address).to.equal('address')
              expect(res.body.abi).to.equal('abi')
              break
            case 'getAddress':
              expect(res.body.address).to.equal('address')
              break
            case 'getAbi':
              expect(res.body.abi).to.equal('abi')
              break
          }
        })

        it('returns 500 for invalid branch or network error', done => {
          request.get(`${path}/not-a-branch`).end((err, res) => {
            expect(err).to.be.null
            expect(res).to.have.status(500)
            done()
          })
        })
      })
    }
  }
})
