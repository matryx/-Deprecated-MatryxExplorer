const router = require('express').Router()
const sig = require('eth-sig-util')

const cookie = 'signature'

router.get('/request', (req, res) => {
  res.set('Access-Control-Allow-Credentials', 'true')
  res.set('Access-Control-Allow-Origin', req.headers.origin)

  const unique = new Array(10)
    .fill(0)
    .map(() => Math.floor(36 * Math.random()).toString(36))
    .join('')
  const message = 'Signingature request ID: ' + unique

  res.cookie(cookie, message, { maxAge: 30 * 1000, signed: true });
  res.json({ message })
})

router.post('/confirm', (req, res) => {
  res.set('Access-Control-Allow-Credentials', 'true')
  res.set('Access-Control-Allow-Origin', req.headers.origin)

  const message = req.signedCookies[cookie]
  const response = { success: false }
  let body;

  try {
    if (typeof req.body === 'string') {
      throw Error
    }
    body = JSON.parse(req.body)
  }
  catch (error) {
    response.error = 'Request body is required and must be a valid plain text JSON.'
    return res.status(400).json(response)
  }

  const { address, signature } = body

  try {
    const recovered = sig.recoverPersonalSignature({ sig: signature, data: message })
    response.success = address.toLowerCase() === recovered.toLowerCase()
    res.clearCookie(cookie);
  } catch (error) {
    response.error = error.message
    res.status(400)
  } finally {
    return res.json(response)
  }
})

module.exports = router
