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
router.get('/id/:tournamentAddress/round/1', (req, res, next) => {
  const id = req.params.tournamentAddress
  var tournamentDetails = {
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
    message: 'This is a temp API with tournamentID' + id,
    data: tournamentDetails
  })
})

// Return the tournament details for a specific tournament
router.get('/address/:tournamentAddress', (req, res, next) => {
  const address = req.params.tournamentAddress
  var tournamentDetails = {
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
    message: 'This is a temp API with tournamentID' + address,
    data: tournamentDetails
  })
})

// router.post('/', (req, res, next) => {
//     res.status(200).json({
//         message: 'handling POST requests to /products'
//     });
// });

module.exports = router
