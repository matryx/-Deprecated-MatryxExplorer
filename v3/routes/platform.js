/**
 * platform.js
 * /platform routes for getting Platform info
 *
 * Authors sam@nanome.ai dev@nanome.ai
 * Copyright (c) 2018, Nanome Inc
 * Licensed under ISC. See LICENSE.md in project root.
 */

// TODO versioning api calls for the abi and latest platform info

const express = require('express')
const router = express.Router()

const { errorHelper } = require('../helpers/responseHelpers')

const abis = require('../helpers/getAbis')
const contracts = require('../helpers/getContracts')

abis.on('update', async () => {
  const Platform = contracts.platform

  let count = +(await Platform.getTournamentCount())
  console.log(`\nCurrent Matryx Platform Address in use: ${Platform.contract.address}`)
  console.log(`There are ${count} tournaments on the Platform.\n`)
})

// Return a message that this route handles all platform specific requests
router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'handling GET requests to /platform'
  })
})

router.get('/getInfo', (req, res, next) => {
  res.status(200).json(abis.platform)
})

router.get('/getAddress', (req, res, next) => {
  const { address } = abis.platform
  res.status(200).json({ address })
})

router.get('/getAbi', (req, res, next) => {
  const { abi } = abis.platform
  res.status(200).json({ abi })
})

router.get('/getCategories', (req, res, next) => {
  const Platform = contracts.platform

  Platform.getCategories()
    .then(categories => res.status(200).json({ categories }))
    .catch(errorHelper(next, 'Error getting top categories'))
})

module.exports = router
