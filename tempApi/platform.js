/*
MatryxExplorer API routing for all tournament based REST calls

author - sam@nanome.ai
Copyright Nanome Inc 2018
*/

const express = require('express');
const router = express.Router();

// Return a list of all tournaments
router.get('/', (req, res, next) => {
    res.status(200).json({
        //TODO send information about the platform
        message: 'handling GET requests to /platform'
    });
});



module.exports = router;
