/*
The Matryx Platform Smart Contract interaction file

author - sam@nanome.ai
Copyright Nanome 2018
*/

// Imports

// Import Web3
const Web3 = require('web3')

const config = require('../../../config');
const externalApiCalls = require('./externalApiCalls')

const matryxABI = externalApiCalls.platformInfoApiCall().then((result, error) => {
    if(!error){
        // console.log(result);
        let matryxAbi = result.results.abi;
        let matryxAddress = result.results.address;
        contract = new web3.eth.Contract(matryxAbi, matryxAddress);
    }
    else{
        console.log("Error during get Platform API call", error);
    }
});



//Develop branch
/*
const matryxAbi = [{"constant":true,"inputs":[],"name":"getBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_author","type":"address"},{"name":"_submission","type":"address"}],"name":"updateMySubmissions","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_tournamentAddress","type":"address"},{"name":"_finalRoundNumber","type":"uint256"},{"name":"_winningSubmissionIndex","type":"uint256"}],"name":"invokeTournamentClosedEvent","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"myTournaments","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"balanceIsNonZero","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_sender","type":"address"}],"name":"isOwner","outputs":[{"name":"_isOwner","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"tournamentCount","outputs":[{"name":"_tournamentCount","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_owner","type":"address"},{"name":"_tournamentAddress","type":"address"},{"name":"_tournamentName","type":"string"},{"name":"_externalAddress","type":"bytes32"},{"name":"_MTXReward","type":"uint256"},{"name":"_entryFee","type":"uint256"}],"name":"invokeTournamentOpenedEvent","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_tournamentName","type":"string"},{"name":"_externalAddress","type":"bytes32"},{"name":"_MTXReward","type":"uint256"},{"name":"_entryFee","type":"uint256"}],"name":"createTournament","outputs":[{"name":"_tournamentAddress","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getOwner","outputs":[{"name":"_owner","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_queryID","type":"uint256"},{"name":"_response","type":"uint256"}],"name":"storeQueryResponse","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_index","type":"uint256"}],"name":"getTournamentAtIndex","outputs":[{"name":"_tournamentAddress","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"allTournaments","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_query","type":"bytes32"},{"name":"_sender","type":"address"}],"name":"Query","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"mySubmissions","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_tournamentAddress","type":"address"}],"name":"getTournament_IsMine","outputs":[{"name":"_isMine","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_toIgnore","type":"uint256"}],"name":"prepareBalance","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_tournamentAddress","type":"address"}],"name":"enterTournament","outputs":[{"name":"_success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_matryxTournamentFactoryAddress","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_owner","type":"address"},{"indexed":false,"name":"_tournamentAddress","type":"address"},{"indexed":false,"name":"_tournamentName","type":"string"},{"indexed":false,"name":"_externalAddress","type":"bytes32"},{"indexed":false,"name":"_MTXReward","type":"uint256"},{"indexed":false,"name":"_entryFee","type":"uint256"}],"name":"TournamentCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_owner","type":"address"},{"indexed":false,"name":"_tournamentAddress","type":"address"},{"indexed":false,"name":"_tournamentName","type":"string"},{"indexed":false,"name":"_externalAddress","type":"bytes32"},{"indexed":false,"name":"_MTXReward","type":"uint256"},{"indexed":false,"name":"_entryFee","type":"uint256"}],"name":"TournamentOpened","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_tournamentAddress","type":"address"},{"indexed":false,"name":"_finalRoundNumber","type":"uint256"},{"indexed":false,"name":"_winningSubmissionIndex","type":"uint256"}],"name":"TournamentClosed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"queryID","type":"string"}],"name":"QueryID","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id","type":"uint256"},{"indexed":false,"name":"sender","type":"address"}],"name":"QueryPerformed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"storedResponse","type":"uint256"}],"name":"StoredResponse","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"response","type":"uint256"}],"name":"ObtainedResponse","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newResponse","type":"uint256"},{"indexed":false,"name":"oldResponse","type":"uint256"}],"name":"FailedToStore","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id","type":"uint256"}],"name":"QueryID","type":"event"}];
*/

// Old platform
/*

const matryxAbi = [{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"tournamentList","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"balanceIsNonZero","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"tournamentId","type":"uint256"}],"name":"submissionCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"idx","type":"uint256"}],"name":"tournamentByIndex","outputs":[{"name":"","type":"uint256"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"tournamentId","type":"uint256"}],"name":"tournamentByAddress","outputs":[{"name":"","type":"uint256"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"tournamentCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"tournaments","outputs":[{"name":"id","type":"uint256"},{"name":"title","type":"string"},{"name":"description","type":"string"},{"name":"bounty","type":"uint256"},{"name":"exists","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"tournamentId","type":"uint256"},{"name":"title","type":"string"},{"name":"body","type":"string"},{"name":"references","type":"string"},{"name":"contributors","type":"string"}],"name":"createSubmission","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getOwner","outputs":[{"name":"_deployer","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_queryID","type":"uint256"},{"name":"_response","type":"uint256"}],"name":"storeQueryResponse","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"tournamentId","type":"uint256"},{"name":"idx","type":"uint256"}],"name":"submissionByIndex","outputs":[{"name":"","type":"uint256"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"tournamentId","type":"uint256"},{"name":"submissionId","type":"uint256"}],"name":"submissionByAddress","outputs":[{"name":"","type":"uint256"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_query","type":"bytes32"},{"name":"_sender","type":"address"}],"name":"Query","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"toIgnore","type":"uint256"}],"name":"prepareBalance","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"title","type":"string"},{"name":"description","type":"string"},{"name":"bounty","type":"uint256"}],"name":"createTournament","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id","type":"uint256"},{"indexed":false,"name":"sender","type":"address"}],"name":"QueryPerformed","type":"event"}];

*/

//develop branch
// const matryxAddress = "0x450ccbc9f86739c8ff0f454ab69cf2ededa12ca2";
//old platform
// const matryxAddress = "0x7c4970b887cfa95062ead0708267009dcd564017";

// platformInfoApiCall().then(function(result){
// externalApiCalls.platformInfoApiCall().then(function(result){
//     contract = new web3.eth.Contract(result.abi, result.address);
// });

// Attach to the RPC
const web3 = new Web3("http://localhost:8545")
// const web3 = new Web3(proccess.env.WEB3_PROVIDER)


//TODO Error handling when no chain is attached

var platformCalls = {}

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
