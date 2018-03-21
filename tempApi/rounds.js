/*
MatryxExplorer API routing for all tournament based REST calls

author - sam@nanome.ai
Copyright Nanome Inc 2018
*/

const express = require('express')
const router = express.Router()

// Welcome to rounds
router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'handling GET requests to /rounds'
  })
})

// Return the tournament details for a specific tournament
// TODO destroy this and put in the correct one
router.get('/id/:tournamentAddress/round/1', (req, res, next) => {
  const id = req.params.tournamentAddress
  let roundDetails = {
    'title': 'Suborbital Spaceplane Airfoil Design',
    'bounty': 100,
    'description': 'The process of airfoil design proceeds from a knowledge of \
  the relationship between geometry and pressure distribution. Airfoil design is \
  application specific. Some airfoils need only to minimize drag force while others \
  need to maximize lift. As our aircraft needs to reach upper atmosphere as quickly as \
  possible, this tournament focuses on the latter; See Section IV for technical specifications.',
    'submissions':
    [
      {
        'submissionTitle': 'Lift-to-drag maximization for single airfoil at M = 0.63',
        'submissionDate': '1519427539',
        'submissionAddress': '0xa0e239b0abf4582366adaff486ee268c848c4409'
      },
      {
        'submissionTitle': 'High Lift, Low Aspect Ratio Airfoil',
        'submissionDate': '1519427539',
        'submissionAddress': '0x851b7f3ab81bd8df354f0d7640efcd7288553419'
      },
      {
        'submissionTitle': 'Low Reynolds Number Airfoil',
        'submissionDate': '1519427539',
        'submissionAddress': '0x32be343b94f860124dc4fee278fdcbd38c102d88'
      }
    ]
  }
  res.status(200).json({
    message: 'This is a temp API with tournamentID' + id,
    data: roundDetails
  })
})

// Return the tournament details for a specific tournament
router.get('/id/:roundId', (req, res, next) => {
  const address = req.params.roundId
  // TODO fix this
  let roundDetails = {
    'title': 'Suborbital Spaceplane Airfoil Design',
    'bounty': 100,
    'description': 'The process of airfoil design proceeds from a knowledge of \
  the relationship between geometry and pressure distribution. Airfoil design is \
  application specific. Some airfoils need only to minimize drag force while others \
  need to maximize lift. As our aircraft needs to reach upper atmosphere as quickly as \
  possible, this tournament focuses on the latter; See Section IV for technical specifications.',
    'submissions':
    [
      {
        'address': '0xa0e239b0abf4582366adaff486ee268c848c4409',
        'title': 'Lift-to-drag maximization for single airfoil at M = 0.63'

      },
      {
        'address': '0x851b7f3ab81bd8df354f0d7640efcd7288553419',
        'title': 'High Lift, Low Aspect Ratio Airfoil'
      },
      {
        'address': '0x32be343b94f860124dc4fee278fdcbd38c102d88',
        'title': 'Low Reynolds Number Airfoil'
      }
    ]
  }
  res.status(200).json({
    message: 'This is a temp API with round address' + address,
    data: roundDetails
  })
})

// Return the tournament details for a specific tournament
router.get('/address/:roundAddress', (req, res, next) => {
  const address = req.params.roundAddress
  // TODO fix this
  let roundDetails = {
    'title': 'Suborbital Spaceplane Airfoil Design',
    'bounty': 100,
    'description': 'The process of airfoil design proceeds from a knowledge of \
  the relationship between geometry and pressure distribution. Airfoil design is \
  application specific. Some airfoils need only to minimize drag force while others \
  need to maximize lift. As our aircraft needs to reach upper atmosphere as quickly as \
  possible, this tournament focuses on the latter; See Section IV for technical specifications.',
    'submissions':
    [
      {
        'address': '0xa0e239b0abf4582366adaff486ee268c848c4409',
        'title': 'Lift-to-drag maximization for single airfoil at M = 0.63'

      },
      {
        'address': '0x851b7f3ab81bd8df354f0d7640efcd7288553419',
        'title': 'High Lift, Low Aspect Ratio Airfoil'
      },
      {
        'address': '0x32be343b94f860124dc4fee278fdcbd38c102d88',
        'title': 'Low Reynolds Number Airfoil'
      }
    ]
  }
  res.status(200).json({
    message: 'This is a temp API with round address' + address,
    data: roundDetails
  })
})

// router.post('/', (req, res, next) => {
//     res.status(200).json({
//         message: 'handling POST requests to /products'
//     });
// });

module.exports = router
