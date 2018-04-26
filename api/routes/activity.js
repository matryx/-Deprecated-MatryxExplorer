/*
MatryxExplorer API routing for all round based REST calls

author - sam@nanome.ai
Copyright Nanome Inc 2018
*/

const express = require('express')
const router = express.Router()

// const ethPlatform = require('../controllers/gateway/platformCalls')
const matryxPlatformCalls = require('../controllers/gateway/matryxPlatformCalls')

// Finish Backend
router.get('/', (req, res, next) => {
  matryxPlatformCalls.getPlatformActivity().then(function (result) {
    res.status(200).json({
      activity: result
    })
  })
})

module.exports = router
