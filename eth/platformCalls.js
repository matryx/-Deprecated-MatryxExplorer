/*
The Matryx Platform Smart Contract interaction file

author - sam@nanome.ai
Copyright Nanome 2018
*/

// Imports
const config = require('../config');
const externalApiCalls = require('./externalApiCalls')

// Import Web3
const Web3 = require('web3')

let contract;
let platformInfo;

// Attach to the RPC
const web3 = new Web3(config.rpcURL + config.rpcPort)

var platformCalls = {}

platformCalls.setPlatformInfo = function(data){
    platformInfo = data;
}

// Get the latest Matryx Platform contract address and abi
// externalApiCalls.getLatestPlatformInfo()
//     .then(function (matryx){
//         contract = new web3.eth.Contract(matryx.results.abi, matryx.results.address)
//     });

// console.log(matryx)

// Attach to the contract
// const contract = new web3.eth.Contract(matryx.results.abi, matryx.results.address)


// getTournamentCount() {
//   return new Promise((resolve, reject) => {
//     contract.methods.tournamentCount().call({}, (err, res) => {
//       if (err) reject(err)
//       else resolve(parseInt(res))
//     })
//   })
// }


// Method for getting all the tournaments

// Method for getting the tournament details given an address

// Method for getting the tournament details given an id



// module.exports = tournamentTier;
