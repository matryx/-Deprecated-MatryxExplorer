/*
The Matryx Platform Smart Contract interaction file

authors - sam@nanome.ai
Nanome 2018
*/

// Imports

// Import Web3
const Web3 = require('web3')

const config = require('../../../config')
const externalApiCalls = require('./externalApiCalls')

/*
Uncomment this snippet when the contract ABI and address is already deployed on the private chain and matryx health monitor
*/
/*
const matryxABI = externalApiCalls.platformInfoApiCall().then((result, error) => {
  if (!error) {
        // console.log(result);
    let matryxAbi = result.results.abi
    let matryxAddress = result.results.address
    contract = web3.eth.Contract(matryxAbi, matryxAddress)
  } else {
    console.log('Error during get Platform API call', error)
  }
})
*/

/*
Uncomment

//TODO add the ABI for tournament and submission and rounds from externalApiCalls + locally for testing

*/
// Develop branch
/*
const matryxAbi = [{"constant":true,"inputs":[],"name":"getBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_author","type":"address"},{"name":"_submission","type":"address"}],"name":"updateMySubmissions","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_tournamentAddress","type":"address"},{"name":"_finalRoundNumber","type":"uint256"},{"name":"_winningSubmissionIndex","type":"uint256"}],"name":"invokeTournamentClosedEvent","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"myTournaments","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"balanceIsNonZero","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_sender","type":"address"}],"name":"isOwner","outputs":[{"name":"_isOwner","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"tournamentCount","outputs":[{"name":"_tournamentCount","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_owner","type":"address"},{"name":"_tournamentAddress","type":"address"},{"name":"_tournamentName","type":"string"},{"name":"_externalAddress","type":"bytes32"},{"name":"_MTXReward","type":"uint256"},{"name":"_entryFee","type":"uint256"}],"name":"invokeTournamentOpenedEvent","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_tournamentName","type":"string"},{"name":"_externalAddress","type":"bytes32"},{"name":"_MTXReward","type":"uint256"},{"name":"_entryFee","type":"uint256"}],"name":"createTournament","outputs":[{"name":"_tournamentAddress","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getOwner","outputs":[{"name":"_owner","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_queryID","type":"uint256"},{"name":"_response","type":"uint256"}],"name":"storeQueryResponse","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_index","type":"uint256"}],"name":"getTournamentAtIndex","outputs":[{"name":"_tournamentAddress","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"allTournaments","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_query","type":"bytes32"},{"name":"_sender","type":"address"}],"name":"Query","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"mySubmissions","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_tournamentAddress","type":"address"}],"name":"getTournament_IsMine","outputs":[{"name":"_isMine","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_toIgnore","type":"uint256"}],"name":"prepareBalance","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_tournamentAddress","type":"address"}],"name":"enterTournament","outputs":[{"name":"_success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_matryxTournamentFactoryAddress","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_owner","type":"address"},{"indexed":false,"name":"_tournamentAddress","type":"address"},{"indexed":false,"name":"_tournamentName","type":"string"},{"indexed":false,"name":"_externalAddress","type":"bytes32"},{"indexed":false,"name":"_MTXReward","type":"uint256"},{"indexed":false,"name":"_entryFee","type":"uint256"}],"name":"TournamentCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_owner","type":"address"},{"indexed":false,"name":"_tournamentAddress","type":"address"},{"indexed":false,"name":"_tournamentName","type":"string"},{"indexed":false,"name":"_externalAddress","type":"bytes32"},{"indexed":false,"name":"_MTXReward","type":"uint256"},{"indexed":false,"name":"_entryFee","type":"uint256"}],"name":"TournamentOpened","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_tournamentAddress","type":"address"},{"indexed":false,"name":"_finalRoundNumber","type":"uint256"},{"indexed":false,"name":"_winningSubmissionIndex","type":"uint256"}],"name":"TournamentClosed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"queryID","type":"string"}],"name":"QueryID","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id","type":"uint256"},{"indexed":false,"name":"sender","type":"address"}],"name":"QueryPerformed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"storedResponse","type":"uint256"}],"name":"StoredResponse","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"response","type":"uint256"}],"name":"ObtainedResponse","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newResponse","type":"uint256"},{"indexed":false,"name":"oldResponse","type":"uint256"}],"name":"FailedToStore","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id","type":"uint256"}],"name":"QueryID","type":"event"}];
*/

// Current Deployment
const matryxAddress = '0xc46e279235b78971fa432feb37493e797fc32b54'
const matryxAbi = JSON.parse('[{"constant":true,"inputs":[],"name":"getBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_author","type":"address"},{"name":"_submission","type":"address"}],"name":"updateMySubmissions","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_tournamentAddress","type":"address"},{"name":"_finalRoundNumber","type":"uint256"},{"name":"_winningSubmissionIndex","type":"uint256"}],"name":"invokeTournamentClosedEvent","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"myTournaments","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"balanceIsNonZero","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_sender","type":"address"}],"name":"isOwner","outputs":[{"name":"_isOwner","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"tournamentCount","outputs":[{"name":"_tournamentCount","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_owner","type":"address"},{"name":"_tournamentAddress","type":"address"},{"name":"_tournamentName","type":"string"},{"name":"_externalAddress","type":"bytes32"},{"name":"_MTXReward","type":"uint256"},{"name":"_entryFee","type":"uint256"}],"name":"invokeTournamentOpenedEvent","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_tournamentName","type":"string"},{"name":"_externalAddress","type":"bytes32"},{"name":"_MTXReward","type":"uint256"},{"name":"_entryFee","type":"uint256"}],"name":"createTournament","outputs":[{"name":"_tournamentAddress","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getOwner","outputs":[{"name":"_owner","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_queryID","type":"uint256"},{"name":"_response","type":"uint256"}],"name":"storeQueryResponse","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_index","type":"uint256"}],"name":"getTournamentAtIndex","outputs":[{"name":"_tournamentAddress","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"allTournaments","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_query","type":"bytes32"},{"name":"_sender","type":"address"}],"name":"Query","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"mySubmissions","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_tournamentAddress","type":"address"}],"name":"getTournament_IsMine","outputs":[{"name":"_isMine","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_toIgnore","type":"uint256"}],"name":"prepareBalance","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_tournamentAddress","type":"address"}],"name":"enterTournament","outputs":[{"name":"_success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_matryxTournamentFactoryAddress","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_owner","type":"address"},{"indexed":false,"name":"_tournamentAddress","type":"address"},{"indexed":false,"name":"_tournamentName","type":"string"},{"indexed":false,"name":"_externalAddress","type":"bytes32"},{"indexed":false,"name":"_MTXReward","type":"uint256"},{"indexed":false,"name":"_entryFee","type":"uint256"}],"name":"TournamentCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_owner","type":"address"},{"indexed":false,"name":"_tournamentAddress","type":"address"},{"indexed":false,"name":"_tournamentName","type":"string"},{"indexed":false,"name":"_externalAddress","type":"bytes32"},{"indexed":false,"name":"_MTXReward","type":"uint256"},{"indexed":false,"name":"_entryFee","type":"uint256"}],"name":"TournamentOpened","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_tournamentAddress","type":"address"},{"indexed":false,"name":"_finalRoundNumber","type":"uint256"},{"indexed":false,"name":"_winningSubmissionIndex","type":"uint256"}],"name":"TournamentClosed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"queryID","type":"string"}],"name":"QueryID","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id","type":"uint256"},{"indexed":false,"name":"sender","type":"address"}],"name":"QueryPerformed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"storedResponse","type":"uint256"}],"name":"StoredResponse","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"response","type":"uint256"}],"name":"ObtainedResponse","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newResponse","type":"uint256"},{"indexed":false,"name":"oldResponse","type":"uint256"}],"name":"FailedToStore","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id","type":"uint256"}],"name":"QueryID","type":"event"}]')

const tournamentAbi = JSON.parse('[{"constant":true,"inputs":[],"name":"entryFee","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"tournamentOpen","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"maxRounds","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_entrantAddress","type":"address"}],"name":"enterUserInTournament","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"matryxTokenAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newMaxRounds","type":"uint256"}],"name":"setNumberOfRounds","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_sender","type":"address"}],"name":"isOwner","outputs":[{"name":"_isOwner","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"reviewPeriod","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_bountyMTX","type":"uint256"}],"name":"createRound","outputs":[{"name":"_roundAddress","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"tournamentOpenedTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_submissionAddress","type":"address"}],"name":"invokeSubmissionCreatedEvent","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"tournamentClosedTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_sender","type":"address"}],"name":"isEntrant","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getExternalAddress","outputs":[{"name":"_externalAddress","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_duration","type":"uint256"}],"name":"startRound","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"submissionCount","outputs":[{"name":"_submissionCount","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"matryxRoundFactoryAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"BountyMTX","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getOwner","outputs":[{"name":"_owner","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"currentRound","outputs":[{"name":"_currentRound","type":"uint256"},{"name":"_currentRoundAddress","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"rounds","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_submissionIndex","type":"uint256"}],"name":"chooseWinner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"string"},{"name":"_author","type":"address"},{"name":"_externalAddress","type":"bytes32"},{"name":"_contributors","type":"address[]"},{"name":"_references","type":"address[]"},{"name":"_publicallyAccessible","type":"bool"}],"name":"createSubmission","outputs":[{"name":"_submissionAddress","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"openTournament","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"roundIsOpen","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_submissionIndex","type":"uint256"}],"name":"closeTournament","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"platformAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"mySubmissions","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getEntryFee","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"externalAddress","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"timeCreated","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_platformAddress","type":"address"},{"name":"_matryxRoundFactoryAddress","type":"address"},{"name":"_owner","type":"address"},{"name":"_tournamentName","type":"string"},{"name":"_externalAddress","type":"bytes32"},{"name":"_BountyMTX","type":"uint256"},{"name":"_entryFee","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_roundIndex","type":"uint256"}],"name":"RoundCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_roundIndex","type":"uint256"}],"name":"RoundStarted","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_roundIndex","type":"uint256"},{"indexed":false,"name":"_submissionAddress","type":"address"}],"name":"SubmissionCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_submissionIndex","type":"uint256"}],"name":"RoundWinnerChosen","type":"event"}]')

// Old platform
/*

const matryxAbi = [{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"tournamentList","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"balanceIsNonZero","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"tournamentId","type":"uint256"}],"name":"submissionCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"idx","type":"uint256"}],"name":"tournamentByIndex","outputs":[{"name":"","type":"uint256"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"tournamentId","type":"uint256"}],"name":"tournamentByAddress","outputs":[{"name":"","type":"uint256"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"tournamentCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"tournaments","outputs":[{"name":"id","type":"uint256"},{"name":"title","type":"string"},{"name":"description","type":"string"},{"name":"bounty","type":"uint256"},{"name":"exists","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"tournamentId","type":"uint256"},{"name":"title","type":"string"},{"name":"body","type":"string"},{"name":"references","type":"string"},{"name":"contributors","type":"string"}],"name":"createSubmission","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getOwner","outputs":[{"name":"_deployer","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_queryID","type":"uint256"},{"name":"_response","type":"uint256"}],"name":"storeQueryResponse","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"tournamentId","type":"uint256"},{"name":"idx","type":"uint256"}],"name":"submissionByIndex","outputs":[{"name":"","type":"uint256"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"tournamentId","type":"uint256"},{"name":"submissionId","type":"uint256"}],"name":"submissionByAddress","outputs":[{"name":"","type":"uint256"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_query","type":"bytes32"},{"name":"_sender","type":"address"}],"name":"Query","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"toIgnore","type":"uint256"}],"name":"prepareBalance","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"title","type":"string"},{"name":"description","type":"string"},{"name":"bounty","type":"uint256"}],"name":"createTournament","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id","type":"uint256"},{"indexed":false,"name":"sender","type":"address"}],"name":"QueryPerformed","type":"event"}];

*/

// develop branch
// const matryxAddress = "0x450ccbc9f86739c8ff0f454ab69cf2ededa12ca2";
// old platform
// const matryxAddress = "0x7c4970b887cfa95062ead0708267009dcd564017";

// platformInfoApiCall().then(function(result){
// externalApiCalls.platformInfoApiCall().then(function(result){
    // contract = web3.eth.Contract(result.abi, result.address);
// });

// Attach to the RPC
// @Dev local
// const web3 = new Web3('http://localhost:8545')
// @Dev prod env
// const web3 = new Web3(proccess.env.WEB3_PROVIDER)
// @Dev Matryx Official customRPC
const web3 = new Web3('http://customrpc.matryx.ai:8545')
// @Dev Matryx Elastic IP Address ->
// const web3 = new Web3('http://52.8.65.20:8545')
matryxPlatformContract = new web3.eth.Contract(matryxAbi, matryxAddress)

// @Dev for terminal javascript console geth ->
// matryxContract = web3.eth.contract(matryxPlatformAbi).at(matryxPlatformAddress)

// TODO Error handling when no chain is attached

var platformCalls = {}

// prepare getFunctionHashes
// var hashes = getFunctionHashes(matryxAbi)
// console.log(hashes[0])
/*
Tournament Calls
*/

platformCalls.getTournamentCount = function () {
  return new Promise((resolve, reject) => {
    matryxPlatformContract.methods.tournamentCount().call({}, (err, res) => {
      if (err) reject(err)
      else resolve(parseInt(res))
    })
  })
}

// TODO Add max's code
platformCalls.getAllTournaments = function () {
  return new Promise((resolve, reject) => {
    matryxPlatformContract.methods.tournamentCount().call({}, (err, res) => {
      if (err) reject(err)
      else resolve(parseInt(res))
    })
  })
}

// TODO currently only returns tournament owner, needs to return all tournament info
platformCalls.getTournamentByAddress = function (_tournamentAddress) {
  return new Promise((resolve, reject) => {
      // Attach to the tournament using the ABI and the _tournamentAddress
    console.log('Starting the contract attachment')
    tournamentContract = new web3.eth.Contract(tournamentAbi, _tournamentAddress)
    console.log(tournamentContract)
    // Get tournament details
    tournamentContract.methods.owner().call({}, (err, res) => {
      console.log('response is a' + typeof res) // output is a string
      if (err) reject(err)
      else resolve(res)
    })
  })
}

// TODO currently returns owner of the tournament, needs to return all the tournament info
platformCalls.getTouramentById = function (_tournament_id) {
  return new Promise((resolve, reject) => {
    matryxPlatformContract.methods.allTournaments(_tournament_id).call({}, (err, tournamentAddress) => {
      if (err) reject(err)
      else {
        tournamentContract = new web3.eth.Contract(tournamentAbi, tournamentAddress)
        tournamentContract.methods.owner().call({}, (err, res) => {
          console.log('response is a' + typeof res) // output is a string
          if (err) reject(err)
          else {
            resolve({
              tournamentId: _tournament_id,
              tournamentOwner: res
            })
          }
        })
      }
    })
  })
}

platformCalls.getTournamentOwnerByAddress = function (_tournamentAddress) {
  return new Promise((resolve, reject) => {
    tournamentContract = new web3.eth.Contract(tournamentAbi, _tournamentAddress)
    tournamentContract.methods.owner().call({}, (err, res) => {
      if (err) reject(err)
      else {
        resolve({
          tournamentOwner: res,
          tournamentAddress: _tournamentAddress
        })
      }
    })
  })
}

platformCalls.getTournamentOwnerById = function (_tournament_id) {
  return new Promise((resolve, reject) => {
    matryxPlatformContract.methods.allTournaments(_tournament_id).call({}, (err, _tournamentAddress) => {
      if (err) reject(err)
      else {
        tournamentContract = new web3.eth.Contract(tournamentAbi, _tournamentAddress)
        tournamentContract.methods.owner().call({}, (err, res) => {
          console.log('response is a' + typeof res) // output is a string
          if (err) reject(err)
          else {
            resolve({
              tournamentOwner: res,
              tournamentId: _tournament_id,
              tournamentAddress: _tournamentAddress
            })
          }
        })
      }
    })
  })
}

// TODO fix this when max updates the platform
platformCalls.getAllTournaments = function (_tournament_id) {
  return new Promise((resolve, reject) => {
      // Setup the object
    var allTournaments = []
    matryxPlatformContract.methods.tournamentCount().call({}, (err, _tournamentCount) => {
        // for loop over the number of tournaments in _tournamentCount
      for (let i = 0; i < _tournamentCount; i++) {
            // make a new allTournamentsDTO object
        allTournamentsDTO = new AllTournamentsDTO()

        matryxPlatformContract.methods.allTournaments(i).call({}, (err, _tournamentAddress) => {
          if (err) reject(err)
          else {
            allTournamentsDTO._address = _tournamentAddress
            tournamentContract = new web3.eth.Contract(tournamentAbi, _tournamentAddress)
            tournamentContract.methods.getTitle().call({}, (err, _title) => {
              if (err) reject(err)
              else {
                        // set the title for eachTournament
                allTournamentsDTO._tournamentTitle = _title
                tournamentContract.methods.BountyMTX().call({}, (err, _mtx) => {
                  if (err) reject(err)
                  else {
                                // set the bountyMTX for eachTournament
                    allTournamentsDTO._mtx = _mtx
                                // TODO access tournamentDescription
                    tournamentContract.methods.tournamentDescription().call({}, (err, _description) => {
                      if (err) reject(err)
                      else {
                                        // get the description for eachTournament
                        allTournamentsDTO._tournamentDescription = _description
                        tournamentContract.methods.getCategory().call({}, (err, _category) => {
                          if (err) reject(err)
                          else {
                                                // get the category for eachTournament
                            allTournamentsDTO._category = _category
                            tournamentContract.methods.maxRounds().call({}, (err, _maxRounds) => {
                              if (err) reject(err)
                              else {
                                                        // get the maxRounds for eachTournament
                                allTournamentsDTO._totalRounds = _maxRounds
                                tournamentContract.methods.currentRound().call({}, (err, _currentRound) => {
                                  if (err) reject(err)
                                  else {
                                                                // get the currentRound for eachTournament
                                    allTournamentsDTO._currentRound = _currentRound[0]
                                    tournamentContract.methods.numberOfParticipants().call({}, (err, _numberOfParticipants) => {
                                      if (err) reject(err)
                                      else {
                                                                        // get the numberOfParticipants for eachTournament
                                        allTournamentsDTO._numberOfParticipants = _numberOfParticipants
                                        console.log(allTournamentsDTO)
                                      }
                                    })
                                  }
                                })
                              }
                            })
                          }
                        })
                      }
                    })
                  }
                })
              }
            })
          }
        }).then(

            // Add the push
            allTournaments.push(allTournamentsDTO)

        )
      }
    })
    resolve(allTournaments)
  })
}

/*
@Dev
var allTournamentsDTO = {
  'tournamentTitle': _tournamentTitle,
  'mtx': _mtx,
  'tournamentDescription': _tournamentDescription,
  'category': _category,
  'totalRounds': _totalRounds,
  'currentRound': _currentRound,
  'numberOfParticipants': _numberOfParticipants,
  'address': _address,
  'ipType': _ipType,
  'tournamentID': _tournamentID
}
*/
// TODO after solving the problem in the next function, solve it with these additional methods after max updates the platform
platformCalls.getAllTournamentsTest = function () {
  return new Promise((resolve, reject) => {
      // Setup the object
    var allTournaments = []
    matryxPlatformContract.methods.tournamentCount().call({}, (err, _tournamentCount) => {
        // for loop over the number of tournaments in _tournamentCount
      for (let i = 0; i < _tournamentCount; i++) {
            // make a new allTournamentsDTO object
        allTournamentsDTO = new allTournamentsDTO()

        matryxPlatformContract.methods.allTournaments(i).call({}, (err, _tournamentAddress) => {
          if (err) reject(err)
          else {
            allTournamentsDTO._address = _tournamentAddress
            tournamentContract = new web3.eth.Contract(tournamentAbi, _tournamentAddress)
            tournamentContract.methods.BountyMTX().call({}, (err, _mtx) => {
              if (err) reject(err)
              else {
                                // set the bountyMTX for eachTournament
                allTournamentsDTO._mtx = _mtx
                tournamentContract.methods.maxRounds().call({}, (err, _maxRounds) => {
                  if (err) reject(err)
                  else {
                                                        // get the maxRounds for eachTournament
                    allTournamentsDTO._totalRounds = _maxRounds
                    tournamentContract.methods.currentRound().call({}, (err, _currentRound) => {
                      if (err) reject(err)
                      else {
                                                                // get the currentRound for eachTournament
                        allTournamentsDTO._currentRound = _currentRound[0]
                        tournamentContract.methods.submissionCount().call({}, (err, _numberOfParticipants) => {
                          if (err) reject(err)
                          else {
                                                                        // get the numberOfParticipants for eachTournament
                            allTournamentsDTO._numberOfParticipants = _numberOfParticipants
                            console.log(allTournamentsDTO)
                          }
                        })
                      }
                    })
                  }
                })
              }
            })
          }
        }).then(
                      allTournaments.push(allTournamentsDTO)
                  )
      }
    }).then(resolve(allTournaments))
  })
}

// Working if you check console
// TODO map array to the route response and handle multiple tournaments
platformCalls.getAllTournamentsTestBasic = function () {
  return new Promise((resolve, reject) => {
      // Setup the array for the tournaments
    var allTournaments = []
    matryxPlatformContract.methods.tournamentCount().call({}, (err, _tournamentCount) => {
        // for loop over the number of tournaments in _tournamentCount
      for (let i = 0; i < _tournamentCount; i++) {
        const allTournamentsDTO = {
          tournamentTitle: '',
          mtx: 0,
          tournamentDescription: '',
          category: '',
          totalRounds: 0,
          currentRound: 0,
          numberOfParticipants: 0,
          address: '',
          ipType: '',
          tournamentID: 0
        }
        matryxPlatformContract.methods.allTournaments(i).call({}, (err, _tournamentAddress) => {
          if (err) reject(err)
          else {
            allTournamentsDTO.address = _tournamentAddress
            tournamentContract = new web3.eth.Contract(tournamentAbi, _tournamentAddress)
            tournamentContract.methods.BountyMTX().call({}, (err, _mtx) => {
              if (err) reject(err)
              else {
                // set the bountyMTX for eachTournament
                allTournamentsDTO.mtx = _mtx
                console.log(allTournamentsDTO)
                allTournaments.push(allTournamentsDTO)
              }
            })
          }
        })
      }
    })
    console.log('logs for all Tournaments: ' + allTournaments)
    resolve(allTournaments)
  })
}

// Activity Code

// TODO use web3 to get all previous events for each of the situations (from block to this block) and maybe filter the event
// TODO https://github.com/ethereum/wiki/wiki/JavaScript-API#web3ethfilter
// TODO We want to assume that all the data we needs comes from the platform events being triggered and no additional searches are needed

platformCalls.activityAlpha = function () {
  return new Promise((resolve, reject) => {
          // TODO swap out for the activity info
    matryxPlatformContract.methods.allTournaments(_tournament_id).call({}, (err, tournamentAddress) => {
      if (err) reject(err)
      else {
        tournamentContract = new web3.eth.Contract(tournamentAbi, tournamentAddress)
        tournamentContract.methods.owner().call({}, (err, res) => {
          console.log('response is a' + typeof res) // output is a string
          if (err) reject(err)
          else {
            resolve({
              tournamentId: _tournament_id,
              tournamentOwner: res
            })
          }
        })
      }
    })
  })
}

platformCalls.activity = function () {
  return new Promise((resolve, reject) => {
        // "news": "0xb794f5ea0ba39494ce839613fffba74279579268 created a new bounty: \"Solve Diabetes\""

    var news = {activity: []}
    matryxPlatformContract.events.TournamentCreated(null, (error, event) => {
      if (error) {
        console.log('Error with setting up event: ' + error)
      } else {
        console.log('Set up queryPerformed event: ' + event)
      }
    })
        .on('data', (event) => {
        // event TournamentCreated(bytes32 _discipline, address _owner, address _tournamentAddress, string _tournamentName, bytes32 _externalAddress, uint256 _MTXReward, uint256 _entryFee);

          var discipline = event.returnValues[0]
          var owner = event.returnValues[1]
          var tournamentName = event.returnValues[3]

          var message = owner + ' created a new bounty ' + tournamentName
         // var messageWithDiscipline = owner + " created a new " + discipline + " bounty " + tournamentName;
          console.log('news:' + message)
        }).on('changed', function (event) {
           // remove event from local database
        }).on('error', function (error) {
          console.log('error in jsoncreator.js: ' + error)
        })

        // "news": "0xb794f5ea0ba39494ce839613fffba74279579268 got rewarded 400 MTX"
    matryxPlatformContract.events.TournamentClosed(null, (error, event) => {
      if (error) {
        console.log('Error with setting up event: ' + error)
      } else {
        console.log('Set up queryPerformed event: ' + event)
      }
    }).on('data', (event) => {
         // event TournamentClosed(address _tournamentAddress, uint256 _finalRoundNumber, uint256 _winningSubmissionAddress);
      var tournamentAddress = event.returnValues[0]
      var winningSubmissionAddress = event.returnValues[2]
      var submission = web3.eth.Contract(matryxSubmissionABI, winningSubmissionAddress)

      submission.methods.name.getBalance().then((receipt) => {
        var rewardAmount = receipt

        var message = winningSubmissionAddress + ' got rewarded ' + rewardAmount + ' MTX'
        console.log('news:' + message)
      })
    }).on('changed', function (event) {
           // remove event from local database
    }).on('error', function (error) {
      console.log('error in jsoncreator.js: ' + error)
    })

        // "news": "0xb794f5ea0ba39494ce839613fffba74279579268 entered tournament: \"Erotic Greek Sculpture\""
    matryxPlatformContract.events.UserEnteredTournament(null, (error, event) => {
      if (error) {
        console.log('Error with setting up event: ' + error)
      } else {
        console.log('Set up queryPerformed event: ' + event)
      }
    }).on('data', (event) => {
         // event UserEnteredTournament(address _entrant, address _tournamentAddress);
      var entrant = event.returnValues[0]
      var tournamentAddress = event.returnValues[1]
      var tournament = web3.eth.Contract(matryxTournamentABI, matryxTournamentAddress)
      tournament.methods.name.send().then((receipt) => {
        var tournamentName = receipt

        var message = entrant + ' entered tournament ' + tournamentName
        console.log('news:' + message)
      })
    }).on('changed', function (event) {
           // remove event from local database
    }).on('error', function (error) {
      console.log('error in jsoncreator.js: ' + error)
    })
  }
)
}

/*
Get Activity using web3ethfilter

Input params:
String|Object - The string "latest" or "pending" to watch for changes in the latest block or pending transactions respectively. Or a filter options object as follows:
fromBlock: Number|String - The number of the earliest block (latest may be given to mean the most recent and pending currently mining, block). By default latest.
toBlock: Number|String - The number of the latest block (latest may be given to mean the most recent and pending currently mining, block). By default latest.
address: String - An address or a list of addresses to only get logs from particular account(s).
topics: Array of Strings - An array of values which must each appear in the log entries. The order is important, if you want to leave topics out use null, e.g. [null, '0x00...']. You can also pass another array for each topic with options for that topic e.g. [null, ['option1', 'option2']]
*/

platformCalls.getActivity2 = function () {
  return new Promise((resolve, reject) => {
   // contract.methods.tournamentByAddress(42 + _tournament_id).call({}, (err, res) => {

// set the options

// options = {address: "0xc46e279235b78971fa432feb37493e797fc32b54"}
// web3.eth.filter(options, function (error, result) {if (!error) { console.log(result)}})

    web3.eth.filter(options, function (error, result) {
      if (!error) {
        console.log(result)
      }
    })
    if (err) reject(err)
    else {
      resolve({
        _tournament_id: parseInt(res['0']),
        title: res['1'],
        description: res['2'],
        bounty: parseFloat(res['3'])
      })
    }
  })
}

// TODO get this working
platformCalls.getAllTournaments2 = function () {
  return new Promise((resolve, reject) => {
    matryxPlatformContract.events.TournamentCreated({fromBlock: 0, toBlock: 'latest'}, (results, error) => {
      results.get(function (error, logs) {
        var allDetails = {}
        for (var i = 0; i < logs.length; i++) {
          var log = logs[i]
          console.log('Saving tournament # ' + i)

          var discipline = log.returnValues[0]
          var owner = log.returnValues[1]
          var tournamentAddress = log.returnValues[2]
          var tournamentTitle = log.returnValues[3]
          var externalAddress = log.returnValues[4]
          var MTXReward = log.returnValues[5]
          var entryFee = log.returnValues[6]

          var tournamentDetails =
            {
              'tournamentTitle': tournamentTitle,
              'mtx': MTXReward,
              'tournamentDescription': '',
              'category': discipline,
              'totalRounds': 0,
              'currentRound': 0,
              'numberOfParticipants': 0,
              'ipType': ''
            }
          allDetails.push(tournamentDetails)
          if (i == logs.length - 1) {
            resolve(allDetails) // TODO swap out for return
                  // return allTournaments
          }
        }
      })
    })
  })
}

/*
Logic for View all tournaments
var matryxPlatformContract = web3.eth.contract(matryxPlatformContract.abi);
var platform = MyContract.at(matryxPlatformContract.address);

var TournamentCreatedEvent = platform.events.TournamentCreated({fromBlock: 0, toBlock: 'latest'});

var allTournaments = TournamentCreatedEvent.get(function(error, logs){

	var allDetails = {};
	for(var i = 0; i < logs.length; i++)
	{
		var log = logs[i];

		var discipline = log.returnValues[0];
		var owner = log.returnValues[1];
		var tournamentAddress = log.returnValues[2];
		var tournamentTitle = log.returnValues[3];
		var externalAddress = log.returnValues[4];
		var MTXReward = log.returnValues[5];
		var entryFee = log.returnValues[6];

		var tournamentDetails =
		{
			"tournamentTitle": tournamentTitle,
			"mtx": MTXReward,
			"tournamentDescription": "",
			"category": discipline,
			"totalRounds": 0,
			"currentRound": 0,
			"numberOfParticipants": 0,
			"ipType": ""
		};

		ipfs.files.cat(ipfsPath, function (err, file) {
			if (err) {
			throw err
			}

			var fileAsString = file.toString('utf8');
			var firstLine = fileAsString.split("\n")[0];
			tournamentDetails["tournamentDescription"] = firstLine;

			tournament.methods.maxRounds().then((receipt) => {
		  		tournamentDetails["totalRounds"] = receipt;

		  		tournament.methods.rounds().then((receipt)=> {
					tournamentDetails["currentRound"] = receipt.length;

					tournament.methods.entrantCount().then((receipt) => {
						tournamentDetails["numberOfParticipants"] = receipt;

						allDetails.push(tournamentDetails);
						if(i == logs.length - 1)
						{
							return allTournaments;
						}
					});
				});
			})
		})
	}
});

*/

/*
Rounds
*/

/*
Submissions
*/

// Get the submission count for the tournament given the tournament address
platformCalls.getSubmissionCount = function (_tournamentAddress) {
  return new Promise((resolve, reject) => {
    tournamentContract = new web3.eth.Contract(tournamentAbi, _tournamentAddress)
    tournamentContract.methods.submissionCount().call({}, (err, res) => {
      if (err) reject(err)
      else {
        console.log('There are ' + res + ' submissions for the tournament at address: ' + _tournamentAddress)
        resolve(res)
      }
    })
  })
}

/*
 Helper functions
// TODO move this to its own controllers
*/
//
// function getFunctionHashes (abi) {
//   var hashes = []
//   for (var i = 0; i < abi.length; i++) {
//     var item = abi[i]
//     if (item.type != 'function') continue
//     var signature = item.name + '(' + item.inputs.map(function (input) { return input.type }).join(',') + ')'
//     var hash = web3.sha3(signature)
//     console.log(item.name + '=' + hash)
//     hashes.push({name: item.name, hash: hash})
//   }
//   return hashes
// }
//
// function findFunctionByHash (hashes, functionHash) {
//   for (var i = 0; i < hashes.length; i++) {
//     if (hashes[i].hash.substring(0, 10) == functionHash.substring(0, 10)) {
//       return hashes[i].name
//     }
//   }
//   return null
// }

module.exports = platformCalls
