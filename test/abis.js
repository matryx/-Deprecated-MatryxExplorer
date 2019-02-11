describe('ABI tests:', () => {
  let routes = [
    { base: '/platform/', routes: ['getInfo', 'getAddress', 'getAbi'] },
    { base: '/token/', routes: ['getInfo', 'getAddress', 'getAbi'] },
    { base: '/tournaments/', routes: ['getAbi'] },
    { base: '/rounds/', routes: ['getAbi'] }
  ]

  for (const route of routes) {
    for (const subroute of route.routes) {
      const path = route.base + subroute
      describe(path, () => {
        let err, res
        before(done => {
          request.get(path).end((e, r) => {
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
              expect(res.body.address).to.equal('0x0000000000000000000000000000000000000000')
              expect(Array.isArray(res.body.abi)).to.equal(true)
              break
            case 'getAddress':
              expect(res.body.address).to.equal('0x0000000000000000000000000000000000000000')
              break
            case 'getAbi':
              expect(Array.isArray(res.body.abi)).to.equal(true)
              break
          }
        })
      })
    }
  }
})
