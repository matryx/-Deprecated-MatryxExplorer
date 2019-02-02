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
  const isTournament = await Platform.isTournament(address)
  if (!isTournament) {
    const error = new Error(`Tournament ${address} not found`)
    error.status = 404
    errorHelper(next, error.message)(error)
  }
  return isTournament
}

// inputs: response next and potential Round address
// output: true if address is Round
const validateRound = async (next, address) => {
  if (!validateAddress(next, address)) return

  const Platform = contracts.platform
  const isRound = await Platform.isRound(address)
  if (!isRound) {
    const error = new Error(`Round ${address} not found`)
    error.status = 404
    errorHelper(next, error.message)(error)
  }
  return isRound
}

// inputs: response next and potential Commit hash
// output: true if address is Commit
const validateCommit = async (next, hash) => {
  // TODO validate with joi
  throw new Error("validateCommit not yet implemented")
}

module.exports = {
  errorHelper,
  validateAddress,
  validateTournament,
  validateRound,
  validateCommit
}
