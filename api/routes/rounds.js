/*
MatryxExplorer API routing for all round based REST calls

author - sam@nanome.ai
Copyright Nanome Inc 2018
*/

const express = require('express')
const router = express.Router()

const ethPlatform = require('../controllers/gateway/platformCalls')

// Return a list of all rounds
router.get('/', (req, res, next) => {
  res.status(200).json({
        // TODO send back the list of tournaments
        //
    message: 'handling GET requests to /products'
  })
})

// Return the tournament details for a specific tournament
router.get('/id/:roundId', (req, res, next) => {
  const id = req.params.roundId
  res.status(200).json({
    message: 'You discovered the rounds response for a roundID',
    id: id
  })
})

// Return the tournament details for a specific tournament
router.get('/address/:roundAddress', (req, res, next) => {
  const id = req.params.roundAddress
  if (id == 'special') {
    res.status(200).json({
      message: 'You discovered the rounds response given a roundAddress',
      id: id
    })
  }
})

// router.post('/', (req, res, next) => {
//     res.status(200).json({
//         message: 'handling POST requests to /products'
//     });
// });

module.exports = router
