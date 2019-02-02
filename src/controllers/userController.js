/**
 * userController.js
 * Helper methods for getting User data
 *
 * Authors dev@nanome.ai
 * Copyright (c) 2018, Nanome Inc
 * Licensed under ISC. See LICENSE.md in project root.
 */

const abis = require('../helpers/getAbis')
const contracts = require('../helpers/getContracts')

let userController = {}

userController.getData = (userAddress) => {
  const User = contracts.user
  return User.getData(userAddress)
}

userController.getTournaments = (userAddress) => {
  return User.getTournaments(userAddress)
}

module.exports = userController
