/*
The Matryx Platform Smart Contract interaction file

authors - sam@nanome.ai
Nanome 2018
*/

const http = require('http')
const fetch = require('node-fetch')

let externalApiCalls = {}

// TODO: Add error handling for non valid versions.
externalApiCalls.getMatryxPlatformInfo = function (branch) {
  return new Promise((resolve, reject) => {
    if (branch == 'v1') {
      let responsev1 = require('../../../data/abi/v1/platform')
      resolve(responsev1)
    }
    if (branch == 'v2') {
      let responsev2 = require('../../../data/abi/v2/platform')
      resolve(responsev2)
    } else {
      let matryxPlatformAbiUrl = 'https://raw.githubusercontent.com/matryx/matryx-alpha-source/' + branch + '/build/contracts/MatryxPlatform.json'

      fetch(matryxPlatformAbiUrl).then(function (result) {
        console.log('Getting Platform Abi from Matryx Platform Github')
        let jsonResult = result.json()

      // TODO: When max fixes network migration files to save correctly then activate
      // resolve(jsonResult.networks.777.address)
        let tempAddressResponse = require('../../../data/abi/QA/platform')
        jsonResult = tempAddressResponse

        resolve(jsonResult)
      })
    }
  })
}

// TODO: Add error handling for non valid versions.
externalApiCalls.getMatryxPlatformAddress = function (branch) {
  return new Promise((resolve, reject) => {
    if (branch == 'v1') {
      let responsev1 = require('../../../data/abi/v1/platform')
      resolve(responsev1.address)
    }
    if (branch == 'v2') {
      let responsev2 = require('../../../data/abi/v2/platform')
      resolve(responsev2.address)
    }
    let matryxPlatformAbiUrl = 'https://raw.githubusercontent.com/matryx/matryx-alpha-source/' + branch + '/build/contracts/MatryxPlatform.json'

    fetch(matryxPlatformAbiUrl).then(function (result) {
      console.log('Getting Platform Abi from Matryx Platform Github')
      let jsonResult = result.json()

      // TODO: When max fixes network migration files to save correctly then activate
      // resolve(jsonResult.networks.777.address)
      let tempAddressResponse = require('../../../data/abi/QA/platform')
      jsonResult = tempAddressResponse.address

      resolve(jsonResult)
    })
  })
}
// TODO: Add error handling for non valid versions.

externalApiCalls.getMatryxPlatformAbi = function (branch) {
  return new Promise((resolve, reject) => {
    if (branch == 'v1') {
      let responsev1 = require('../../../data/abi/v1/platform')
      resolve(responsev1.abi)
    }
    if (branch == 'v2') {
      let responsev2 = require('../../../data/abi/v2/platform')
      resolve(responsev2.abi)
    }
    let matryxPlatformAbiUrl = 'https://raw.githubusercontent.com/matryx/matryx-alpha-source/' + branch + '/build/contracts/MatryxPlatform.json'

    fetch(matryxPlatformAbiUrl).then(function (result) {
      console.log('Getting Platform Abi from Matryx Platform Github')
      let jsonResult = result.json()
      resolve(jsonResult)
    })
  })
}

// TODO: Add error handling for non valid versions.
externalApiCalls.getMatryxTournamentAbi = function (branch) {
  return new Promise((resolve, reject) => {
    console.log('externalApiCalls called')
    if (branch == 'v1') {
      reject('Abi does not exist')
    }
    if (branch == 'v2') {
      let responsev2 = require('../../../data/abi/v2/tournament')
      resolve(responsev2)
    } else {
      let matryxTournamentAbiUrl = 'https://raw.githubusercontent.com/matryx/matryx-alpha-source/' + branch + '/build/contracts/MatryxTournament.json'

      fetch(matryxTournamentAbiUrl).then(function (result) {
        console.log('Getting Round Abi from Matryx Round Github')
        let jsonResult = result.json()

      // TODO: When max fixes network migration files to save correctly then activate
      // resolve(jsonResult.networks.777.address)
        let tempAddressResponse = require('../../../data/abi/QA/tournament')
        jsonResult = tempAddressResponse

        resolve(jsonResult)
      })
    }
  })
}

// TODO: Add error handling for non valid versions.
externalApiCalls.getMatryxSubmissionAbi = function (branch) {
  return new Promise((resolve, reject) => {
    console.log('externalApiCalls called')
    if (branch == 'v1') {
      reject('Abi does not exist')
    }
    if (branch == 'v2') {
      let responsev2 = require('../../../data/abi/v2/submission')
      resolve(responsev2)
    } else {
      let matryxSubmissionAbiUrl = 'https://raw.githubusercontent.com/matryx/matryx-alpha-source/' + branch + '/build/contracts/MatryxSubmission.json'

      fetch(matryxSubmissionAbiUrl).then(function (result) {
        console.log('Getting Round Abi from Matryx Round Github')
        let jsonResult = result.json()

      // TODO: When max fixes network migration files to save correctly then activate
      // resolve(jsonResult.networks.777.address)
        let tempAddressResponse = require('../../../data/abi/QA/submission')
        jsonResult = tempAddressResponse

        resolve(jsonResult)
      })
    }
  })
}

// TODO: Add error handling for non valid versions.
externalApiCalls.getMatryxRoundAbi = function (branch) {
  return new Promise((resolve, reject) => {
    console.log('externalApiCalls called')
    if (branch == 'v1') {
      reject('Abi does not exist')
    }
    if (branch == 'v2') {
      let responsev2 = require('../../../data/abi/v2/round')
      resolve(responsev2)
    } else {
      let matryxRoundAbiUrl = 'https://raw.githubusercontent.com/matryx/matryx-alpha-source/' + branch + '/build/contracts/MatryxRound.json'

      fetch(matryxRoundAbiUrl).then(function (result) {
        console.log('Getting Round Abi from Matryx Round Github')
        let jsonResult = result.json()

      // TODO: When max fixes network migration files to save correctly then activate
      // resolve(jsonResult.networks.777.address)
        let tempAddressResponse = require('../../../data/abi/QA/round')
        jsonResult = tempAddressResponse

        resolve(jsonResult)
      })
    }
  })
}

module.exports = externalApiCalls
