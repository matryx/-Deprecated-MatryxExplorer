/**
 * users.js
 * /users routes for getting User info
 *
 * Authors dev@nanome.ai
 * Copyright (c) 2018, Nanome Inc
 * Licensed under ISC. See LICENSE.md in project root.
 */

const express = require('express')
const router = express.Router()

const userController = require('../controllers/userController')
const { errorHelper, validateAddress } = require('../helpers/responseHelpers')

const abis = require('../helpers/getAbis')

// Return a confirmation the API is live
router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'handling GET requests to /users'
  })
})

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
