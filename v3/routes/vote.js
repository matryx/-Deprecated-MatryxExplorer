const router = require('express').Router()
const Joi = require('joi')
const db = require('../dbService')
const jsonParse = require('../middleware/jsonParse') // For cross-origin cookies. Must accept String or FormData
const confirmSignature = require('../middleware/signature')

router.post('/', jsonParse, confirmSignature, async (req, res, next) => {
  const validation = Joi.validate(req.body,
    {
      recipient: Joi.string().trim().length(42).required(),
      direction: Joi.string().trim().allow('', null)
    },
    { abortEarly: false }
  )
  if (validation.error) {
    return res.status(403).json({
      success: false,
      error: validation.error
    })
  }

  const voter = req.web3Address
  const { recipient, direction } = validation.value

  let upvote
  if (direction && direction.toLowerCase() === 'up') {
    upvote = 1
  } else if (direction && direction.toLowerCase() === 'down') {
    upvote = 0
  }

  try {
    const table = db('vote')
    const query = table.where({
      voter,
      recipient,
    })
    const results = await query

    if (typeof upvote === 'undefined') {
      await query.del()
    } else {
      if (results.length) {
        await query.update({
          upvote: +!!upvote
        })
      } else {
        await table.insert({
          voter,
          recipient,
          upvote: +!!upvote
        })
      }
    }

    res.status(200).json({
      success: true,
      results: {
        voter,
        recipient,
        direction: direction || null
      }
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      error
    })
  }
})

module.exports = router
