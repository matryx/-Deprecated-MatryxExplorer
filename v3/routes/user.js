/**
 * user.js
 * /user routes for getting User info
 *
 * Authors dev@nanome.ai
 * Copyright (c) 2018, Nanome Inc
 * Licensed under ISC. See LICENSE.md in project root.
 */

const router = require('express').Router()
const Joi = require('joi')
const jwt = require('jsonwebtoken');
const sig = require('eth-sig-util')

const auth = require('../middleware/auth')
const asyncWrap = require('../middleware/asyncWrap')
const { getWeb3User } = require('../../db/serviceUser')
const userController = require('../controllers/userController')
const { errorHelper, validateAddress } = require('../helpers/responseHelpers')

const abis = require('../helpers/getAbis')
const jwtSecret = process.env.JWT_SECRET || 'jwtsecret'

// Return a confirmation the API is live
router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'handling GET requests to /user'
  })
})

router.post('/login', asyncWrap(async (req, res) => {
  res.set('Access-Control-Allow-Credentials', 'true') // Required for cross-origin cookies
  res.set('Access-Control-Allow-Origin', req.headers.origin) // Required for cross-origin cookies

  // Parse the JSON body
  let args
  try {
    args = JSON.parse(req.body) // Requires JSON string for cross-origin cookies
  } catch (error) {
    return res.status(403).json({
      success: false,
      error: 'Invalid JSON string'
    })
  }

  // Validate the inputs
  const { owner, signature } = Joi.attempt(args,
    {
      owner: Joi.string().trim().length(42).required(),
      signature: Joi.string().trim().length(132).required(),
    },
    { abortEarly: false }
  )

  // Authenticate the signature
  const sigCookie = 'signature'
  const message = req.signedCookies[sigCookie]
  const recovered = sig.recoverPersonalSignature({ sig: signature, data: message })
  if (owner.toLowerCase() !== recovered.toLowerCase()) {
    return res.status(401).json({
      success: false,
      error: 'Signature does not match or has expired.'
    })
  }
  res.clearCookie(sigCookie)

  // Generate auth token
  const user = await getWeb3User(owner)
  const expiresIn = 24 * 60 * 60;
  const token = jwt.sign({ id: user.id }, jwtSecret, {
    expiresIn: expiresIn
  });

  res.status(200).json({
    success: true,
    results: {
      user,
      token
    }
  })
}))

router.get('/session', auth, asyncWrap(async (req, res) => {
  res.status(200).json({
    success: true,
    results: req.user
  })
}))

router.get('/getInfo', (req, res, next) => {
  res.status(200).json(abis.user)
})

router.get('/getAddress', (req, res, next) => {
  res.status(200).json({ address: abis.user.address })
})

router.get('/getAbi', (req, res, next) => {
  res.status(200).json({ abi: abis.user.abi })
})

router.get('/address/:userAddress', (req, res, next) => {
  const { userAddress } = req.params
  if (!validateAddress(next, userAddress)) return

  userController
    .getData(userAddress)
    .then(user => res.status(200).json({ user }))
    .catch(errorHelper(next, 'Error getting User data'))
})

module.exports = router
