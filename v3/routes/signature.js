const router = require('express').Router()

const cookie = 'signature'

router.get('/', (req, res) => {
  res.set('Access-Control-Allow-Credentials', 'true') // Required for cross-origin cookies
  res.set('Access-Control-Allow-Origin', req.headers.origin) // Required for cross-origin cookies

  const unique = new Array(10)
    .fill(0)
    .map(() => Math.floor(36 * Math.random()).toString(36))
    .join('')
  const message = 'Signingature request ID: ' + unique

  res.cookie(cookie, message, { maxAge: 30 * 1000, signed: true });
  res.json({ message })
})

module.exports = router
