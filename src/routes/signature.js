const router = require('express').Router()

const cookie = 'signature'

router.get('/', (req, res) => {
  res.set('Access-Control-Allow-Credentials', 'true') // Required for cross-origin cookies
  res.set('Access-Control-Allow-Origin', req.headers.origin) // Required for cross-origin cookies

  const unique = new Array(10)
    .fill(0)
    .map(() => Math.floor(36 * Math.random()).toString(36))
    .join('')
    .toUpperCase()

  // message must not be 32 characters in order for MetaMask to display as text
  const message = 'Signature request ID ' + unique

  res.cookie(cookie, message, { maxAge: 30 * 1000, signed: true });
  res.json({ message })
})

module.exports = router
