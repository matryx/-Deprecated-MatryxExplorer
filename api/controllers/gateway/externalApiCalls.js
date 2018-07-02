/*
The Matryx Platform Smart Contract interaction file

authors - sam@nanome.ai
Nanome 2018
*/
'use strict'

const fetch = require('node-fetch')

// let platformAddress = '0xb966c4b201bba7f6ca583ef3acdf7ea4f0bda93f'
// let tokenAddress = '0x34c7bbb286a87485de537807f7bf8af9045661f0'
// let networkId = process.env.NETWORK_ID

let externalApiCalls = {}

externalApiCalls.getMatryxPlatformInfo = function (branch) {
  return new Promise((resolve, reject) => {
    if (branch == 'v1') {
      let responsev1 = require('../../../data/abi/v1/platform')
      resolve(responsev1)
    } else if (branch == 'v2') {
      let responsev2 = require('../../../data/abi/v2/platform')
      resolve(responsev2)
    } else {
      let matryxPlatformAbiUrl = 'https://raw.githubusercontent.com/matryx/MatryxPlatform/' + branch + '/build/contracts/MatryxPlatform.json'

      fetch(matryxPlatformAbiUrl).then(function (result) {
        console.log('Getting Platform Abi from Matryx Platform Github for: ' + branch)

        let jsonResult = result.json()
        // .then(json => {
        //   json.networks[networkId] = { address: platformAddress }
        //   return json
        // })
        // You need to get the address by adding results['networks'][networkId]['address'] to the promise call who uses this function
        resolve(jsonResult)
      }).catch(function (err) {
        reject(err)
      })
    }
  })
}

externalApiCalls.getMatryxTokenInfo = function (branch) {
  return new Promise((resolve, reject) => {
    let matryxTokenAbiUrl = 'https://raw.githubusercontent.com/matryx/matryx-alpha-source/' + branch + '/build/contracts/MatryxToken.json'

    fetch(matryxTokenAbiUrl).then(function (result) {
      console.log('Getting Token Abi from Matryx Platform Github for: ' + branch)

      let jsonResult = result.json()
      // .then(json => {
      //   json.networks[networkId] = { address: tokenAddress }
      //   return json
      // })
      resolve(jsonResult)
    }).catch(function (err) {
      reject(err)
    })
  })
}

externalApiCalls.getMatryxTournamentAbi = function (branch) {
  return new Promise((resolve, reject) => {
    if (branch == 'v1') {
      reject({ message: 'Abi does not exist' })
    } else if (branch == 'v2') {
      let responsev2 = require('../../../data/abi/v2/tournament')
      resolve(responsev2)
    } else {
      let matryxTournamentAbiUrl = 'https://raw.githubusercontent.com/matryx/matryx-alpha-source/' + branch + '/build/contracts/MatryxTournament.json'

      fetch(matryxTournamentAbiUrl).then(function (result) {
        console.log('Getting Tournament Abi from Matryx Platform Github for: ' + branch)
        let jsonResult = result.json()
        resolve(jsonResult)
      }).catch(function (err) {
        reject(err)
      })
    }
  })
}

externalApiCalls.getMatryxSubmissionAbi = function (branch) {
  return new Promise((resolve, reject) => {
    if (branch == 'v1') {
      reject('Abi does not exist')
    } else if (branch == 'v2') {
      let responsev2 = require('../../../data/abi/v2/submission')
      resolve(responsev2)
    } else {
      let matryxSubmissionAbiUrl = 'https://raw.githubusercontent.com/matryx/matryx-alpha-source/' + branch + '/build/contracts/MatryxSubmission.json'

      fetch(matryxSubmissionAbiUrl).then(function (result) {
        console.log('Getting Submission Abi from Matryx Platform Github for: ' + branch)
        let jsonResult = result.json()
        resolve(jsonResult)
      }).catch(function (err) {
        reject(err)
      })
    }
  })
}

externalApiCalls.getMatryxRoundAbi = function (branch) {
  return new Promise((resolve, reject) => {
    if (branch == 'v1') {
      reject('Abi does not exist')
    } else if (branch == 'v2') {
      let responsev2 = require('../../../data/abi/v2/round')
      resolve(responsev2)
    } else {
      let matryxRoundAbiUrl = 'https://raw.githubusercontent.com/matryx/matryx-alpha-source/' + branch + '/build/contracts/MatryxRound.json'

      fetch(matryxRoundAbiUrl).then(function (result) {
        console.log('Getting Rounds Abi from Matryx Platform Github for: ' + branch)
        let jsonResult = result.json()
        resolve(jsonResult)
      }).catch(function (err) {
        reject(err)
      })
    }
  })
}

module.exports = externalApiCalls
