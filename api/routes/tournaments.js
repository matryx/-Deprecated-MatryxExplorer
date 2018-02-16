/*
MatryxExplorer API routing for all tournament based REST calls

author - sam@nanome.ai
Copyright Nanome Inc 2018
*/

const express = require('express');
const router = express.Router();

const ethPlatform = require('../../eth/platformCalls');

// Return a list of all tournaments
router.get('/', (req, res, next) => {
    res.status(200).json({
        //TODO send back the list of tournaments
        // tournaments = ethPlatform.getAllTournaments();
        message: 'handling GET requests to /products'
    });
});

// Return the tournament details for a specific tournament
router.get('/id/:tournamentID',(req, res, next) => {
    const id = req.params.tournamentID;
    //TODO logic
    //tournamentDetails = ethPlatform.getTournamentDetailsById(id);
        res.status(200).json({
            message: 'You discovered the specialID',
            id: id
        });
});

// Return the tournament details for a specific tournament
router.get('/address/:tournamentAddress',(req, res, next) => {
    const address = req.params.tournamentAddress;
    //TODO logic
    //tournamentDetails = ethPlatform.getTournamentDetailsByAddress(address);
    if(id == 'special'){
        res.status(200).json({
            message: 'You discovered the specialID',
            id: id
        });
    }
});


// router.post('/', (req, res, next) => {
//     res.status(200).json({
//         message: 'handling POST requests to /products'
//     });
// });


module.exports = router;
