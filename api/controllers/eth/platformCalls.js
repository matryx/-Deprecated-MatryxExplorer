/*
The Matryx Platform Smart Contract interaction file

authors - sam@nanome.ai
Nanome 2018
*/

// Imports

// Import Web3
const Web3 = require('web3')

const config = require('../../../config');
const externalApiCalls = require('./externalApiCalls')

/*
Uncomment this snippet when the contract ABI and address is already deployed on the private chain and matryx health monitor
*/
/*
const matryxABI = externalApiCalls.platformInfoApiCall().then((result, error) => {
    if(!error){
        // console.log(result);
        let matryxAbi = result.results.abi;
        let matryxAddress = result.results.address;
        contract = web3.eth.Contract(matryxAbi, matryxAddress);
    }
    else{
        console.log("Error during get Platform API call", error);
    }
});
*/

/*
Uncomment

*/
//Develop branch
/*
const matryxAbi = [{"constant":true,"inputs":[],"name":"getBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_author","type":"address"},{"name":"_submission","type":"address"}],"name":"updateMySubmissions","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_tournamentAddress","type":"address"},{"name":"_finalRoundNumber","type":"uint256"},{"name":"_winningSubmissionIndex","type":"uint256"}],"name":"invokeTournamentClosedEvent","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"myTournaments","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"balanceIsNonZero","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_sender","type":"address"}],"name":"isOwner","outputs":[{"name":"_isOwner","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"tournamentCount","outputs":[{"name":"_tournamentCount","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_owner","type":"address"},{"name":"_tournamentAddress","type":"address"},{"name":"_tournamentName","type":"string"},{"name":"_externalAddress","type":"bytes32"},{"name":"_MTXReward","type":"uint256"},{"name":"_entryFee","type":"uint256"}],"name":"invokeTournamentOpenedEvent","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_tournamentName","type":"string"},{"name":"_externalAddress","type":"bytes32"},{"name":"_MTXReward","type":"uint256"},{"name":"_entryFee","type":"uint256"}],"name":"createTournament","outputs":[{"name":"_tournamentAddress","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getOwner","outputs":[{"name":"_owner","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_queryID","type":"uint256"},{"name":"_response","type":"uint256"}],"name":"storeQueryResponse","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_index","type":"uint256"}],"name":"getTournamentAtIndex","outputs":[{"name":"_tournamentAddress","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"allTournaments","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_query","type":"bytes32"},{"name":"_sender","type":"address"}],"name":"Query","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"mySubmissions","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_tournamentAddress","type":"address"}],"name":"getTournament_IsMine","outputs":[{"name":"_isMine","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_toIgnore","type":"uint256"}],"name":"prepareBalance","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_tournamentAddress","type":"address"}],"name":"enterTournament","outputs":[{"name":"_success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_matryxTournamentFactoryAddress","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_owner","type":"address"},{"indexed":false,"name":"_tournamentAddress","type":"address"},{"indexed":false,"name":"_tournamentName","type":"string"},{"indexed":false,"name":"_externalAddress","type":"bytes32"},{"indexed":false,"name":"_MTXReward","type":"uint256"},{"indexed":false,"name":"_entryFee","type":"uint256"}],"name":"TournamentCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_owner","type":"address"},{"indexed":false,"name":"_tournamentAddress","type":"address"},{"indexed":false,"name":"_tournamentName","type":"string"},{"indexed":false,"name":"_externalAddress","type":"bytes32"},{"indexed":false,"name":"_MTXReward","type":"uint256"},{"indexed":false,"name":"_entryFee","type":"uint256"}],"name":"TournamentOpened","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_tournamentAddress","type":"address"},{"indexed":false,"name":"_finalRoundNumber","type":"uint256"},{"indexed":false,"name":"_winningSubmissionIndex","type":"uint256"}],"name":"TournamentClosed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"queryID","type":"string"}],"name":"QueryID","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id","type":"uint256"},{"indexed":false,"name":"sender","type":"address"}],"name":"QueryPerformed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"storedResponse","type":"uint256"}],"name":"StoredResponse","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"response","type":"uint256"}],"name":"ObtainedResponse","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newResponse","type":"uint256"},{"indexed":false,"name":"oldResponse","type":"uint256"}],"name":"FailedToStore","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id","type":"uint256"}],"name":"QueryID","type":"event"}];
*/


//Current Deployment
const matryxAddress = "0x958bb0087b465e632949aa3df420b8cb9f4ce8d9"
const matryxAbi=JSON.parse("[{\"constant\":true,\"inputs\":[],\"name\":\"getBalance\",\"outputs\":[{\"name\":\"\",\"type\":\"uint256\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"_author\",\"type\":\"address\"},{\"name\":\"_submission\",\"type\":\"address\"}],\"name\":\"updateMySubmissions\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"_tournamentAddress\",\"type\":\"address\"},{\"name\":\"_finalRoundNumber\",\"type\":\"uint256\"},{\"name\":\"_winningSubmissionIndex\",\"type\":\"uint256\"}],\"name\":\"invokeTournamentClosedEvent\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"myTournaments\",\"outputs\":[{\"name\":\"\",\"type\":\"address[]\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"balanceIsNonZero\",\"outputs\":[{\"name\":\"\",\"type\":\"bool\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"name\":\"_sender\",\"type\":\"address\"}],\"name\":\"isOwner\",\"outputs\":[{\"name\":\"_isOwner\",\"type\":\"bool\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"tournamentCount\",\"outputs\":[{\"name\":\"_tournamentCount\",\"type\":\"uint256\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"_owner\",\"type\":\"address\"},{\"name\":\"_tournamentAddress\",\"type\":\"address\"},{\"name\":\"_tournamentName\",\"type\":\"string\"},{\"name\":\"_externalAddress\",\"type\":\"bytes32\"},{\"name\":\"_MTXReward\",\"type\":\"uint256\"},{\"name\":\"_entryFee\",\"type\":\"uint256\"}],\"name\":\"invokeTournamentOpenedEvent\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"_tournamentName\",\"type\":\"string\"},{\"name\":\"_externalAddress\",\"type\":\"bytes32\"},{\"name\":\"_MTXReward\",\"type\":\"uint256\"},{\"name\":\"_entryFee\",\"type\":\"uint256\"}],\"name\":\"createTournament\",\"outputs\":[{\"name\":\"_tournamentAddress\",\"type\":\"address\"}],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"getOwner\",\"outputs\":[{\"name\":\"_owner\",\"type\":\"address\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"_queryID\",\"type\":\"uint256\"},{\"name\":\"_response\",\"type\":\"uint256\"}],\"name\":\"storeQueryResponse\",\"outputs\":[{\"name\":\"success\",\"type\":\"bool\"}],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"owner\",\"outputs\":[{\"name\":\"\",\"type\":\"address\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"name\":\"_index\",\"type\":\"uint256\"}],\"name\":\"getTournamentAtIndex\",\"outputs\":[{\"name\":\"_tournamentAddress\",\"type\":\"address\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"name\":\"\",\"type\":\"uint256\"}],\"name\":\"allTournaments\",\"outputs\":[{\"name\":\"\",\"type\":\"address\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"_query\",\"type\":\"bytes32\"},{\"name\":\"_sender\",\"type\":\"address\"}],\"name\":\"Query\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"mySubmissions\",\"outputs\":[{\"name\":\"\",\"type\":\"address[]\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"name\":\"_tournamentAddress\",\"type\":\"address\"}],\"name\":\"getTournament_IsMine\",\"outputs\":[{\"name\":\"_isMine\",\"type\":\"bool\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"_toIgnore\",\"type\":\"uint256\"}],\"name\":\"prepareBalance\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"newOwner\",\"type\":\"address\"}],\"name\":\"transferOwnership\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"_tournamentAddress\",\"type\":\"address\"}],\"name\":\"enterTournament\",\"outputs\":[{\"name\":\"_success\",\"type\":\"bool\"}],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"name\":\"_matryxTournamentFactoryAddress\",\"type\":\"address\"}],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"constructor\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"name\":\"_owner\",\"type\":\"address\"},{\"indexed\":false,\"name\":\"_tournamentAddress\",\"type\":\"address\"},{\"indexed\":false,\"name\":\"_tournamentName\",\"type\":\"string\"},{\"indexed\":false,\"name\":\"_externalAddress\",\"type\":\"bytes32\"},{\"indexed\":false,\"name\":\"_MTXReward\",\"type\":\"uint256\"},{\"indexed\":false,\"name\":\"_entryFee\",\"type\":\"uint256\"}],\"name\":\"TournamentCreated\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"name\":\"_owner\",\"type\":\"address\"},{\"indexed\":false,\"name\":\"_tournamentAddress\",\"type\":\"address\"},{\"indexed\":false,\"name\":\"_tournamentName\",\"type\":\"string\"},{\"indexed\":false,\"name\":\"_externalAddress\",\"type\":\"bytes32\"},{\"indexed\":false,\"name\":\"_MTXReward\",\"type\":\"uint256\"},{\"indexed\":false,\"name\":\"_entryFee\",\"type\":\"uint256\"}],\"name\":\"TournamentOpened\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"name\":\"_tournamentAddress\",\"type\":\"address\"},{\"indexed\":false,\"name\":\"_finalRoundNumber\",\"type\":\"uint256\"},{\"indexed\":false,\"name\":\"_winningSubmissionIndex\",\"type\":\"uint256\"}],\"name\":\"TournamentClosed\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"name\":\"queryID\",\"type\":\"string\"}],\"name\":\"QueryID\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"name\":\"id\",\"type\":\"uint256\"},{\"indexed\":false,\"name\":\"sender\",\"type\":\"address\"}],\"name\":\"QueryPerformed\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"name\":\"storedResponse\",\"type\":\"uint256\"}],\"name\":\"StoredResponse\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"name\":\"response\",\"type\":\"uint256\"}],\"name\":\"ObtainedResponse\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"name\":\"newResponse\",\"type\":\"uint256\"},{\"indexed\":false,\"name\":\"oldResponse\",\"type\":\"uint256\"}],\"name\":\"FailedToStore\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"name\":\"id\",\"type\":\"uint256\"}],\"name\":\"QueryID\",\"type\":\"event\"}]");



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
    // contract = web3.eth.Contract(result.abi, result.address);
// });

// Attach to the RPC
//@Dev local
// const web3 = new Web3("http://localhost:8545")
//@Dev prod env
// const web3 = new Web3(proccess.env.WEB3_PROVIDER)
//@Dev Matryx Official customRPC
// const web3 = new Web3("http://customrpc.matryx.ai:8545")
//@Dev Matryx Elastic IP Address ->
const web3 = new Web3("http://52.8.65.20:8545")
contract = new web3.eth.Contract(matryxAbi, matryxAddress);

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



//Activity Code

//TODO use web3 to get all previous events for each of the situations (from block to this block) and maybe filter the event
//TODO https://github.com/ethereum/wiki/wiki/JavaScript-API#web3ethfilter
//TODO We want to assume that all the data we needs comes from the platform events being triggered and no additional searches are needed

platformCalls.activity = function(){
    return new Promise((resolve, reject) => {
        // "news": "0xb794f5ea0ba39494ce839613fffba74279579268 created a new bounty: \"Solve Diabetes\""

        var news = {activity: []};

        platform.events.TournamentCreated(null, (error, event) =>
        {
         if(error)
         {
           console.log("Error with setting up event: " + error);
         }
         else
         {
           console.log("Set up queryPerformed event: " + event);
         }

        })
        .on('data', (event) => {

        // event TournamentCreated(bytes32 _discipline, address _owner, address _tournamentAddress, string _tournamentName, bytes32 _externalAddress, uint256 _MTXReward, uint256 _entryFee);

         var discipline = event.returnValues[0];
         var owner = event.returnValues[1];
         var tournamentName = event.returnValues[3];

         var message = owner + " created a new bounty " + tournamentName;
         // var messageWithDiscipline = owner + " created a new " + discipline + " bounty " + tournamentName;
         console.log("news:" + message);
     }).on('changed', function(event){
           // remove event from local database
       }).on('error', function(error){
           console.log("error in jsoncreator.js: " + error);
        });

        // "news": "0xb794f5ea0ba39494ce839613fffba74279579268 got rewarded 400 MTX"
        platform.events.TournamentClosed(null, (error, event) =>
        {
         if(error)
         {
           console.log("Error with setting up event: " + error);
         }
         else
         {
           console.log("Set up queryPerformed event: " + event);
         }

     }).on('data', (event) => {

         // event TournamentClosed(address _tournamentAddress, uint256 _finalRoundNumber, uint256 _winningSubmissionAddress);
         var tournamentAddress = event.returnValues[0];
         var winningSubmissionAddress = event.returnValues[2];
         var submission = web3.eth.Contract(matryxSubmissionABI, winningSubmissionAddress);

         submission.methods.name.getBalance().then((receipt) => {
             var rewardAmount = receipt;

             var message = winningSubmissionAddress + " got rewarded " + rewardAmount + " MTX";
             console.log("news:" + message);
         })
     }).on('changed', function(event){
           // remove event from local database
       }).on('error', function(error){
           console.log("error in jsoncreator.js: " + error);
        });

        // "news": "0xb794f5ea0ba39494ce839613fffba74279579268 entered tournament: \"Erotic Greek Sculpture\""
        platform.events.UserEnteredTournament(null, (error, event) =>
        {
         if(error)
         {
           console.log("Error with setting up event: " + error);
         }
         else
         {
           console.log("Set up queryPerformed event: " + event);
         }

     }).on('data', (event) => {

         // event UserEnteredTournament(address _entrant, address _tournamentAddress);
         var entrant = event.returnValues[0];
         var tournamentAddress = event.returnValues[1];
         var tournament = web3.eth.Contract(matryxTournamentABI, matryxTournamentAddress);
         tournament.methods.name.send().then((receipt) => {
             var tournamentName = receipt;

             var message = entrant + " entered tournament " + tournamentName;
             console.log("news:" + message);
         })
     }).on('changed', function(event){
           // remove event from local database
       }).on('error', function(error){
           console.log("error in jsoncreator.js: " + error);
        });

    }
)};

/*
Get Activity using web3ethfilter

Input params:
String|Object - The string "latest" or "pending" to watch for changes in the latest block or pending transactions respectively. Or a filter options object as follows:
fromBlock: Number|String - The number of the earliest block (latest may be given to mean the most recent and pending currently mining, block). By default latest.
toBlock: Number|String - The number of the latest block (latest may be given to mean the most recent and pending currently mining, block). By default latest.
address: String - An address or a list of addresses to only get logs from particular account(s).
topics: Array of Strings - An array of values which must each appear in the log entries. The order is important, if you want to leave topics out use null, e.g. [null, '0x00...']. You can also pass another array for each topic with options for that topic e.g. [null, ['option1', 'option2']]


*/


platformCalls.getActivity2 = function(){
  return new Promise((resolve, reject) => {
   // contract.methods.tournamentByAddress(42 + _tournament_id).call({}, (err, res) => {

   web3.eth.filter(options, function(error, result){
  if (!error)
    console.log(result);
});
     if (err) reject(err)
     else
       resolve({
         _tournament_id: parseInt(res['0']),
         title: res['1'],
         description: res['2'],
         bounty: parseFloat(res['3'])
     });
   });
};



/*
Logic for View all tournaments
var MatryxPlatform = web3.eth.contract(MatryxPlatform.abi);
var platform = MyContract.at(MatryxPlatform.address);

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


// Get the latest Matryx Platform contract address and abi
// externalApiCalls.getLatestPlatformInfo()
//     .then(function (matryx){
//         contract = web3.eth.Contract(matryx.results.abi, matryx.results.address)
//     });

// console.log(matryx)

// Attach to the contract
// const contract = web3.eth.Contract(matryx.results.abi, matryx.results.address)


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
