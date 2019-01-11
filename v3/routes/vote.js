const router = require('express').Router()
const Joi = require('joi')
const { getVotes, castVote } = require('../../db/serviceVote')
const jsonParse = require('../middleware/jsonParse') // For cross-origin cookies. Must accept String or FormData
const confirmSignature = require('../middleware/signature')
const asyncWrap = require('../middleware/asyncWrap')

router.get('/', asyncWrap(async (req, res) => {
  const results = await getVotes(req.args)
  res.json({
    succes: true,
    results: results
  })
}))

router.post('/', jsonParse, confirmSignature, asyncWrap(async (req, res) => {
  await castVote({
    voter: req.web3Address,
    recipient: req.body.recipient, // Must use req body because it's JSON string due to cross-origin cookie thing
    direction: req.body.direction, // Must use req body because it's JSON string due to cross-origin cookie thing
  })

  res.status(200).json({
    success: true,
    results: {
      voter,
      recipient,
      direction: direction
    }
  })
}))

module.exports = router
