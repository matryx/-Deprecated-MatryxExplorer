/*
TempAPI MatryxExplorer API routing for all tournament based REST calls

author - sam@nanome.ai
Copyright Nanome Inc 2018
*/

const express = require('express');
const router = express.Router();

const ethPlatform = require('../eth/platformCalls');

// Return a list of all tournaments
router.get('/', (req, res, next) => {
    var tournaments = {
    "tournaments":
      [
        {
          "address": "0xb794f5ea0ba39494ce839613fffba74279579268",
          "title": "Suborbital Spaceplane Airfoil Design",
          "bounty": 1000
        },
        {
          "address": "0xe853c56864a2ebe4576a807d26fdc4a0ada51919",
          "title": "Cure for the Zika Virus",
          "bounty": 920000
        },
        {
          "address": "0x281055afc982d96fab65b3a49cac8b878184cb16",
          "title": "Synthetic Carboxysome Production Method",
          "bounty": 819200
        },
        {
          "address": "0x6f46cf5569aefa1acc1009290c8e043747172d89",
          "title": "Dry Battery Cell Structure",
          "bounty": 20000
        },
        {
          "address": "0x90e63c3d53e0ea496845b7a03ec7548b70014a91",
          "title": "A Fifth Bounty",
          "bounty": 5
        },
        {
          "address": "0xab7c74abc0c4d48d1bdad5dcb26153fc8780f83e",
          "title": "A Sixth Bounty",
          "bounty": 6
        },
        {
          "address": "0x53d284357ec70ce289d6d64134dfac8e511c8a3d",
          "title": "A Seventh Bounty",
          "bounty": 7
        },
        {
          "address": "0xf4b51b14b9ee30dc37ec970b50a486f37686e2a8",
          "title": "A Eighth Bounty",
          "bounty": 8
        },
        {
          "address": "0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae",
          "title": "A Ninth Bounty",
          "bounty": 9
        },
        {
          "address": "0xf27daff52c38b2c373ad2b9392652ddf433303c4",
          "title": "A Tenth Bounty",
          "bounty": 10
        }
      ]
  };
  res.status(200).json({
      message: 'API working',
     data: tournaments
  });

  // json(json_data(tournaments))

});

// Return the tournament details for a specific tournament
router.get('/id/:tournamentID',(req, res, next) => {
    const id = req.params.tournamentID;
    var tournamentDetails = {
  "title": "Suborbital Spaceplane Airfoil Design",
  "bounty": 100,
  "description": "The process of airfoil design proceeds from a knowledge of \
  the relationship between geometry and pressure distribution. Airfoil design is \
  application specific. Some airfoils need only to minimize drag force while others \
  need to maximize lift. As our aircraft needs to reach upper atmosphere as quickly as \
  possible, this tournament focuses on the latter; See Section IV for technical specifications.",
  "submissions":
    [
      {
        "address": "0xa0e239b0abf4582366adaff486ee268c848c4409",
        "title": "Lift-to-drag maximization for single airfoil at M = 0.63"

      },
      {
        "address": "0x851b7f3ab81bd8df354f0d7640efcd7288553419",
        "title": "High Lift, Low Aspect Ratio Airfoil"
      },
      {
        "address": "0x32be343b94f860124dc4fee278fdcbd38c102d88",
        "title": "Low Reynolds Number Airfoil"
      }
    ]
};
  res.status(200).json({
      message: 'This is a temp API with tournamentID' + id,
     data: tournamentDetails
  });
});

// Return the tournament details for a specific tournament
router.get('/address/:tournamentAddress',(req, res, next) => {
    const address = req.params.tournamentAddress;
    var tournamentDetails = {
  "title": "Suborbital Spaceplane Airfoil Design",
  "bounty": 100,
  "description": "The process of airfoil design proceeds from a knowledge of \
  the relationship between geometry and pressure distribution. Airfoil design is \
  application specific. Some airfoils need only to minimize drag force while others \
  need to maximize lift. As our aircraft needs to reach upper atmosphere as quickly as \
  possible, this tournament focuses on the latter; See Section IV for technical specifications.",
  "submissions":
    [
      {
        "address": "0xa0e239b0abf4582366adaff486ee268c848c4409",
        "title": "Lift-to-drag maximization for single airfoil at M = 0.63"

      },
      {
        "address": "0x851b7f3ab81bd8df354f0d7640efcd7288553419",
        "title": "High Lift, Low Aspect Ratio Airfoil"
      },
      {
        "address": "0x32be343b94f860124dc4fee278fdcbd38c102d88",
        "title": "Low Reynolds Number Airfoil"
      }
    ]
};
  res.status(200).json({
      message: 'This is a temp API with tournamentID' + address,
     data: tournamentDetails
  });
});


module.exports = router;
