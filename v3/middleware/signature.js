const Joi = require('joi')
const sig = require('eth-sig-util')

const cookieId = 'signature'

module.exports = (req, res, next) => {
  res.set('Access-Control-Allow-Credentials', 'true') // Required for cross-origin cookies
  res.set('Access-Control-Allow-Origin', req.headers.origin) // Required for cross-origin cookies

  const { web3Signature } = req.body
  delete req.body.web3Signature

  const validation = Joi.validate(web3Signature,
    {
      owner: Joi.string().trim().length(42).required(),
      signature: Joi.string().trim().length(132).required(),
    },
    { abortEarly: false }
  )
  if (validation.error) {
    return res.status(403).json({
      success: false,
      error: validation.error
    })
  }

  const { owner, signature } = web3Signature
  req.web3Address = owner
  const message = req.signedCookies[cookieId]
  const response = { success: false }

  try {
    const recovered = sig.recoverPersonalSignature({ sig: signature, data: message })
    response.success = owner.toLowerCase() === recovered.toLowerCase()
    res.clearCookie(cookieId);
    if (!response.success) {
      response.error = 'Signature does not match or has expired.'
      return res.status(403)
    }
  } catch (error) {
    response.error = error.message
    res.status(400)
  } finally {
    next()
  }
}
