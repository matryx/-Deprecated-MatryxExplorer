/**
 * responseHelpers.js
 * Helper methods for error handling and validating inputs
 *
 * Authors dev@nanome.ai
 * Copyright (c) 2018, Nanome Inc
 * Licensed under ISC. See LICENSE.md in project root.
 */

const ethers = require('ethers')

// inputs: next method and optional error log message
// output: error method that takes in error and sends over response
const errorHelper = (next, response) => error => {
  response = error && error.response || response
  next({ message: error.message, response })
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

module.exports = {
  errorHelper,
  validateAddress
}
