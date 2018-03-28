/*
MatryxExplorer API routing for all round based REST calls

author - sam@nanome.ai
Copyright Nanome Inc 2018
*/

const express = require('express')
const router = express.Router()

const filesController = require('../../controllers/filesController')

// Return a message that this route handles activity calls
// TODO return the landing page events to the UI
// Finish Backend
router.get('/getADescriptionIPFSHash', (req, res, next) => {
  filesController.basicDescriptionUploadToIPFS('This is a description').then(function (result) {
    res.status(200).json({
      hash: result
    })
  })
})

module.exports = router
