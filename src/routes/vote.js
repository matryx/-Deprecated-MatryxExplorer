const router = require('express').Router()
const { getVotes, castVote } = require('../../db/serviceVote')
const auth = require('../middleware/auth')
const asyncWrap = require('../middleware/asyncWrap')

router.get('/', asyncWrap(async (req, res) => {
  const results = await getVotes(req.args)
  res.json({
    success: true,
    results: results
  })
}))

router.post('/', auth, asyncWrap(async (req, res) => {
  const voter = req.user.eth_address
  const { recipient, direction } = req.args
  const results = await castVote({ voter, recipient, direction });

  res.status(200).json({
    success: true,
    results: results
  });
}))

module.exports = router
