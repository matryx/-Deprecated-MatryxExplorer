/*
The Matryx submission controller

authors - sam@nanome.ai
Nanome 2018
*/

/*
Imports
*/
const externalApiCalls = require('./gateway/externalApiCalls')
const ipfsCalls = require('./gateway/ipfsCalls')
const matryxPlatformCalls = require('./gateway/matryxPlatformCalls')

let platformController = {}

platformController.getTopCategories = function () {
  return new Promise((resolve, reject) => {
    matryxPlatformCalls.getTopCategories().then(function (result) {
      resolve(result)
    }).catch((err) => {
      reject(err)
    })
  })
}


module.exports = platformController
