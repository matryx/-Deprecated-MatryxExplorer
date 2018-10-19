/**
 * activity.js
 * /activity routes for getting Platform activity
 *
 * Authors sam@nanome.ai dev@nanome.ai
 * Copyright (c) 2018, Nanome Inc
 * Licensed under ISC. See LICENSE.md in project root.
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
