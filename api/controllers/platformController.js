/*
The Matryx submission controller

authors - sam@nanome.ai
Nanome 2018
*/

/*
Imports
*/

const matryxPlatformCalls = require('./gateway/matryxPlatformCalls')

let platformController = {}

platformController.getTopCategories = () => {
  return matryxPlatformCalls.getTopCategories()
}


module.exports = platformController
