/*
MatryxExplorer API routing for all latest activity based REST calls

author - sam@nanome.ai
Copyright Nanome Inc 2018
*/

const express = require('express')
const router = express.Router()

// Return a list of all tournaments
router.get('/', (req, res, next) => {
  var activity = {
    'activity':
    [
      {
        'news': '0xb794f5ea0ba39494ce839613fffba74279579268 created a new bounty: "Solve Diabetes"'
      },
      {
        'news': '0xb794f5ea0ba39494ce839613fffba74279579268 got rewarded 400 MTX'
      },
      {
        'news': '0xb794f5ea0ba39494ce839613fffba74279579268 entered tournament: "Erotic Greek Sculpture"'
      },
      {
        'news': 'joey123 created a new bounty: "Bananas with smiles"'
      },
      {
        'news': 'theR3alKimK created a new bounty: " Booty Shapes"'
      }
    ]
  }
  res.status(200).json({
    message: 'This is a temp API',
    data: activity
  })
})

module.exports = router
