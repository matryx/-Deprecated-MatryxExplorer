/*
The MatryxExplorer IPFS calls file

authors - sam@nanome.ai
Nanome 2018
*/

const http = require('http')
const fetch = require('node-fetch')

var externalApiCalls = {}
ipfsURL = 'https://ipfs.io/ipfs/'

externalApiCalls.platformInfoApiCall = async function () {
  try {
    const response = await fetch('http://health.matryx.ai/latestPlatformInfo')
        // console.log(await response.json());
    return response.json()
  } catch (err) {
    console.log('API fetch for platform address and ABI failed ', err)
  }
}

externalApiCalls.getIpfsData = function (_ipfsHash) {
  return 'IPFS Hash data that gets returned'
}

module.exports = externalApiCalls
