const router = require('express').Router()
const { getVotes, castVote } = require('../../db/serviceVote')
const jsonParse = require('../middleware/jsonParse') // For cross-origin cookies. Must accept String or FormData
const confirmSignature = require('../middleware/signature')
const asyncWrap = require('../middleware/asyncWrap')

router.get('/', asyncWrap(async (req, res) => {
  const results = await getVotes(req.args)
  res.json({
    success: true,
    results: results
  })
}))

router.post('/', jsonParse, confirmSignature, asyncWrap(async (req, res) => {
  const voter = req.web3Address
  const recipient = req.body.recipient // Must use req body because it's JSON string due to cross-origin cookie thing
  const direction = req.body.direction // Must use req body because it's JSON string due to cross-origin cookie thing
  await castVote({ voter, recipient, direction })

  res.status(200).json({
    success: true,
    results: {
      voter,
      recipient,
      direction
    }
  })
}))

module.exports = router
