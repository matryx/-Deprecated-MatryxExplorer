/*
The Matryx Platform Smart Contract interaction file

authors - sam@nanome.ai
Nanome 2018
*/

const http = require('http')
const fetch = require('node-fetch')

let externalApiCalls = {}
ipfsURL = 'https://ipfs.io/ipfs/'

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

externalApiCalls.testIPFS2 = async function (_ipfsHash) {
  try {
    const url = ipfsURL + _ipfsHash
    console.log('Fetching IPFS Data from: ' + url)
    const response = await fetch(url)
        // console.log(await response.json());
    return response.json()
  } catch (err) {
    console.log('API fetch for platform address and ABI failed ', err)
  }
}

externalApiCalls.testIPFS = function (_ipfsHash) {
  return new Promise((resolve, reject) => {
    const url = ipfsURL + _ipfsHash
    console.log('Fetching IPFS Data from: ' + url)
    try {
      fetch(ipfsURL + _ipfsHash, (err, res) => {
        console.log(res)
        resolve(res)
      })
    } catch (err) {
      console.log(err)
    }
  })
}

externalApiCalls.davidIPFS = function (_ipfsHash) {
  return new Promise((resolve, reject) => {
// url (required), options (optional)
    const url = ipfsURL + _ipfsHash

    fetch(url, {
      method: 'get'
    }).then(function (response) {
      console.log(response.toString('utf8'))
      console.log(response.body._outBuffer.toString())
      resolve(response)
    })
  .then(function (myJson) {
    // console.log(myJson)
  }).catch(function (err) {
	// Error :(
    console.log(err)
  })
  })
}

externalApiCalls.getIpfsData = function (_ipfsHash) {
  return 'IPFS Hash data that gets returned'
}

module.exports = externalApiCalls
