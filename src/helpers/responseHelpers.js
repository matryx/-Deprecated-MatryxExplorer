/**
 * responseHelpers.js
 * Helper methods for error handling and validating inputs
 *
 * Authors dev@nanome.ai
 * Copyright (c) 2018, Nanome Inc
 * Licensed under ISC. See LICENSE.md in project root.
 */

const ethers = require('ethers')
const contracts = require('../helpers/getContracts')

// inputs: next method and optional error log message
// output: error method that takes in error and sends over response
const errorHelper = (next, response) => error => {
  response = error && error.response || response
  next({ message: error.message, response, status: error.status })
}

// inputs: response next and address to validate
// output: true if address valid
const validateAddress = (next, address) => {
  try {
    ethers.utils.getAddress(address)
    return true
  } catch (err) {
    errorHelper(next, `${address} is not a valid ethereum address`)(err)
    return false
  }
}

// inputs: response next and potential Tournament address
// output: true if address is Tournament
const validateTournament = async (next, address) => {
  if (!validateAddress(next, address)) return

  const Platform = contracts.platform
  const isT = await Platform.isTournament(address)
  if (!isT) {
    const error = new Error(`Tournament ${address} not found`)
    error.status = 404
    errorHelper(next, error.message)(error)
  }
  return isT
}

// inputs: response next and potential Round address
// output: true if address is Round
const validateRound = async (next, address) => {
  if (!validateAddress(next, address)) return

  const Platform = contracts.platform
  const isR = await Platform.isRound(address)
  if (!isR) {
    const error = new Error(`Round ${address} not found`)
    error.status = 404
    errorHelper(next, error.message)(error)
  }
  return isR
}

// inputs: response next and potential Submission address
// output: true if address is Submission
const validateSubmission = async (next, address) => {
  const Platform = contracts.platform
  const isS = await Platform.isSubmission(address)
  if (!isS) {
    const error = new Error(`Submission ${address} not found`)
    error.status = 404
    errorHelper(next, error.message)(error)
  }
  return isS
}

module.exports = {
  errorHelper,
  validateAddress,
  validateTournament,
  validateRound,
  validateSubmission
}
