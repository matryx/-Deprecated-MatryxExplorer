/**
 * commit.js
 * /commit routes for getting Commit info
 *
 * Authors sam@nanome.ai dev@nanome.ai
 * Copyright (c) 2018, Nanome Inc
 * Licensed under ISC. See LICENSE.md in project root.
 */

const express = require('express')
const router = express.Router()

const abis = require('../helpers/getAbis')

// Return a confirmation the API is live
router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'handling GET requests to /commit'
  })
})

router.get('/getInfo', (req, res, next) => {
  res.status(200).json(abis.commit)
})

router.get('/getAddress', (req, res, next) => {
  res.status(200).json({ address: abis.commit.address })
})

router.get('/getAbi', (req, res, next) => {
  res.status(200).json({ abi: abis.commit.abi })
})

module.exports = router
