/*
The Matryx Platform Smart Contract interaction file

authors - sam@nanome.ai
Nanome 2018
*/

const http = require('http')
const fetch = require('node-fetch')

var externalApiCalls = {}

// externalApiCalls.platformInfoApiCall = function () {
//             return fetch('http://health.matryx.ai/latestPlatformInfo').then(results =>{ return results.json()})
//             };

//
// externalApiCalls.platformInfoApiCall = async function() {
//     try{
//         let data = await fetch('http://health.matryx.ai/latestPlatformInfo');
//         return data;
//     }
//     catch{
//
//     }
// };

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
