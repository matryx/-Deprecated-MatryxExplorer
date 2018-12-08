/**
 * router.js
 * All routes for v2
 *
 * Authors dev@nanome.ai
 * Copyright (c) 2018, Nanome Inc
 * Licensed under ISC. See LICENSE.md in project root.
 */

const express = require('express')
const router = express.Router()

const abis = require('./helpers/getAbis')

router.get('/update', async (req, res, next) => {
  try {
    const updated = await abis.attemptUpdate()
    const message = updated ? 'ABIs updated' : 'ABIs already up to date'
    res.status(200).json({ message })
  } catch (err) {
    next({ response: 'ABIs update failed' })
  }
})

// make sure ABIs are loaded before continuing request
router.use(async (req, res, next) => {
  await abis.loadedAbis
  next()
})

router.get('/', (req, res) => res.sendStatus(200))
router.use('/platform', require('./routes/platform'))
router.use('/tournaments', require('./routes/tournaments'))
router.use('/rounds', require('./routes/rounds'))
router.use('/submissions', require('./routes/submissions'))
// router.use('/activity', require('./routes/activity'))
router.use('/token', require('./routes/token'))
router.use('/ipfs', require('./routes/ipfs'))

module.exports = router
