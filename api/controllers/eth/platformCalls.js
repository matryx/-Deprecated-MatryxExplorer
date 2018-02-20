/*
The Matryx Platform Smart Contract interaction file

author - sam@nanome.ai
Copyright Nanome 2018
*/

// Imports
const config = require('../../../config');
const externalApiCalls = require('./externalApiCalls')

//delete after solving apicall problem
const matryxAbi = [{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"tournamentList","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"balanceIsNonZero","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"tournamentId","type":"uint256"}],"name":"submissionCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"idx","type":"uint256"}],"name":"tournamentByIndex","outputs":[{"name":"","type":"uint256"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"tournamentId","type":"uint256"}],"name":"tournamentByAddress","outputs":[{"name":"","type":"uint256"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"tournamentCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"tournaments","outputs":[{"name":"id","type":"uint256"},{"name":"title","type":"string"},{"name":"description","type":"string"},{"name":"bounty","type":"uint256"},{"name":"exists","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"tournamentId","type":"uint256"},{"name":"title","type":"string"},{"name":"body","type":"string"},{"name":"references","type":"string"},{"name":"contributors","type":"string"}],"name":"createSubmission","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getOwner","outputs":[{"name":"_deployer","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_queryID","type":"uint256"},{"name":"_response","type":"uint256"}],"name":"storeQueryResponse","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"tournamentId","type":"uint256"},{"name":"idx","type":"uint256"}],"name":"submissionByIndex","outputs":[{"name":"","type":"uint256"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"tournamentId","type":"uint256"},{"name":"submissionId","type":"uint256"}],"name":"submissionByAddress","outputs":[{"name":"","type":"uint256"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_query","type":"bytes32"},{"name":"_sender","type":"address"}],"name":"Query","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"toIgnore","type":"uint256"}],"name":"prepareBalance","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"title","type":"string"},{"name":"description","type":"string"},{"name":"bounty","type":"uint256"}],"name":"createTournament","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id","type":"uint256"},{"indexed":false,"name":"sender","type":"address"}],"name":"QueryPerformed","type":"event"}];
const matryxAddress = "0x7c4970b887cfa95062ead0708267009dcd564017";



// platformInfoApiCall().then(function(result){
// externalApiCalls.platformInfoApiCall().then(function(result){
//     contract = new web3.eth.Contract(result.abi, result.address);
// });

// Import Web3
const Web3 = require('web3')

let contract;
let platformInfo;

// Attach to the RPC
//TODO swap out localhost with ENV variables in config
const web3 = new Web3("http://localhost:8545")


var platformCalls = {}

contract = new web3.eth.Contract(matryxAbi, matryxAddress);

platformCalls.getTournamentCount = function(){
    return new Promise((resolve, reject) => {
      contract.methods.tournamentCount().call({}, (err, res) => {
        if (err) reject(err)
        else resolve(parseInt(res))
      })
    })
  }

platformCalls.getTouramentById = function(_tournament_id){
  return new Promise((resolve, reject) => {
   contract.methods.tournamentByAddress(42 + _tournament_id).call({}, (err, res) => {
     if (err) reject(err)
     else
       resolve({
         _tournament_id: parseInt(res['0']),
         title: res['1'],
         description: res['2'],
         bounty: parseFloat(res['3'])
     });
   });
});
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



module.exports = platformCalls;
