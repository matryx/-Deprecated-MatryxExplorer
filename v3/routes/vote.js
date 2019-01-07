const router = require('express').Router()
const db = require('../dbService')

router.post('/', async (req, res, next) => {
  const { voter, vote_content, vote } = req.body

  let upvote
  if (vote === 'up') {
    upvote = 1
  } else if (vote === 'down') {
    upvote = 0
  }

  try {
    const query = db('votes')
      .where({
        voter,
        vote_content,
      })

    if (!vote) {
      await query.del()
    } else {
      const results = await query
      if (results.length) {
        await query
          .update({
            upvote: +!!upvote
          })
      } else {
        await db('votes')
          .insert({
            voter,
            vote_content,
            upvote: +!!upvote
          })
      }
    }

    res.status(200).json({
      success: true,
      results: {}
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error
    })
  }
})

module.exports = router
