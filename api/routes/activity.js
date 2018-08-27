/*
MatryxExplorer API routing for all round based REST calls

author - sam@nanome.ai
Copyright Nanome Inc 2018
*/

const express = require('express')
const router = express.Router()

const { errorHelper } = require('../helpers/responseHelpers')

// TODO: activity
// router.get('/', (req, res, next) => {
//   Platform
//     .getActivity()
//     .then(activity => res.status(200).json({ activity }))
//     .catch(errorHelper(next, 'Error getting activity'))
// })

module.exports = router
