/*
The Matryx Platform Smart Contract interaction file

authors - sam@nanome.ai
Nanome 2018
*/

/*
Imports
*/
const Web3 = require('web3')
const config = require('../../../config')
const externalApiCalls = require('./externalApiCalls')
const platformInfoV1 = require('../../../data/abi/v1/platform')
const currentPlatformInfo = require('../../../data/abi/v2/platform')

/*
 Attach to the RPC
*/
// @Dev local
// const web3 = new Web3('http://localhost:8545')

var web3 = new Web3()
// web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'))
web3.setProvider(new web3.providers.HttpProvider('http://customrpc.matryx.ai:8545'))

// TODO switch to config variable
// @Dev prod env
// const web3 = new Web3(proccess.env.WEB3_PROVIDER)

// @Dev Matryx Official customRPC
// const web3 = new Web3('http://customrpc.matryx.ai:8545') // Elastic IP Address -> http://52.8.65.20:8545

matryxPlatformAddress = currentPlatformInfo.address
matryxPlatformAbi = currentPlatformInfo.abi

console.log('Current Matryx Platform Address in use: \'' + matryxPlatformAddress + '\'')
// matryxPlatformContract = new web3.eth.contract(matryxPlatformAbi, matryxPlatformAddress)
// console.log(matryxPlatformContract)
// @Dev for terminal javascript console geth ->
matryxPlatformContract = web3.eth.contract(matryxPlatformAbi).at(matryxPlatformAddress)

// console.log(matryxPlatformContract.tournamentCount().call()) // fails "TypeError: this.provider.send is not a function"
// console.log(matryxPlatformContract.methods.tournamentCount().call()) // ^TypeError: Cannot read property 'tournamentCount' of undefined
// console.log(matryxPlatformContract.owner())
console.log(matryxPlatformContract.tournamentCount())

// TODO Error handling when no chain is attached

var platformCalls = {}

// TODO use this for events, if not then delete
// prepare getFunctionHashes
// var hashes = getFunctionHashes(matryxAbi)
// console.log(hashes[0])
/*
Tournament Calls
*/

platformCalls.getTournamentCount = function () {
  return new Promise((resolve, reject) => {
    matryxPlatformContract.tournamentCount((err, res) => {
      if (err) reject(err)
      else {
        // console.log(res)
        resolve(parseInt(res))
      }
    })
  })
}

// TODO
platformCalls.getAllTournaments = function () {
  return new Promise((resolve, reject) => {
    matryxPlatformContract.methods.tournamentCount((err, res) => {
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
// TODO switch this to a promise.all function to handle all the requests
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
// TODO switch to a promise.all function instead of .then
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

// TODO add a round details response for both round address and id given a tournament address

/*
TODO add the following after talking to max
_title: '',
_description: '',
_submissions: []

*/
platformCalls.getCurrentRoundFromTournamentAddress = function (_tournamentAddress) {
  return new Promise((resolve, reject) => {
    var currentRoundResponse = {
      _title: '',
      _bounty: 0,
      _description: '',
      _currentRound: 0,
      _roundAddress: '',
      _submissions: []
    }

    tournamentContract = new web3.eth.Contract(tournamentAbi, _tournamentAddress)
    tournamentContract.methods.currentRound().call({}, (err, _currentRoundInfo) => {
      if (err) reject(err)
      else {
        currentRoundResponse._currentRound = _currentRoundInfo[0]
        currentRoundResponse._roundAddress = _currentRoundInfo[1]

        roundContract = new web3.eth.Contract(roundAbi, _currentRoundInfo[1])

        roundContract.methods.bountyMTX().call({}, (err, _bounty) => {
          if (err) reject(err)
          else {
            currentRoundResponse._bounty = _bounty
            console.log(currentRoundResponse)
            resolve(currentRoundResponse)
          }
        })
      }
    })
  })
}

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

/* TODO talk to max about getting parent info from submission and round for the BELOW function
//Need to add

_submissionId: 0,
  _submissionDescription: '',
  _submissionJson: [ { _Items: [] } ],
  _submissionIpfsHash: '',
    _submissionRewardTotal: 0,
    _submissionSelectedRound: 0,
    _parentInfo:
      [ { _currentRound: 0,
          _totalRounds: 0,
          _roundAddress: '',
          _roundMtx: 0,
          _tournamentName: '',
          _tournamentAddress: '' } ] }

*/
// TODO submission description from ipfs hash
// TODO JSON of submission goes to IPFS -> get hash -> put hash in externalAddress (parent folder)

// Get the submission count for the tournament given the tournament address
platformCalls.getSubmissionByAddress = function (_submissionAddress) {
  return new Promise((resolve, reject) => {
    var submissionDetails = {
      _submissionTitle: '',
      _submissionAddress: '',
      _submissionAuthor: '',
      _submissionId: 0,
      _submissionDescription: '',
      _submissionCollaborators: [],
      _submissionReferences: [],
      _submissionJson: [
        {
          _Items: []
        }
      ],
      _submissionIpfsHash: '',
      _submissionRewardTotal: 0,
      _submissionSelectedRound: 0,
      _submissionDate: '',
      _parentInfo: [
        {
          _currentRound: 0,
          _totalRounds: 0,
          _roundAddress: '',
          _roundMtx: 0,
          _tournamentName: '',
          _tournamentAddress: ''
        }
      ]
    }
// TODO switch to promise.all
    submissionContract = new web3.eth.Contract(submissionAbi, _submissionAddress)
    submissionContract.methods.getTitle().call({}, (err, _title) => {
      if (err) reject(err)
      else {
        submissionDetails._submissionTitle = _title
        submissionDetails._submissionAddress = _submissionAddress

        submissionContract.methods.getAuthor().call({}, (err, _author) => {
          if (err) reject(err)
          else {
            submissionDetails._submissionAuthor = _author
            submissionContract.methods.getContributors().call({}, (err, _contributors) => {
              if (err) reject(err)
              else {
                submissionDetails._submissionCollaborators = _contributors
                submissionContract.methods.getReferences().call({}, (err, _references) => {
                  if (err) reject(err)
                  else {
                    submissionDetails._submissionReferences = _references
                    submissionContract.methods.getTimeSubmitted().call({}, (err, _timeSubmitted) => {
                      if (err) reject(err)
                      else {
                        submissionDetails._submissionDate = _timeSubmitted
                        submissionContract.methods.getTimeSubmitted().call({}, (err, _timeSubmitted) => {
                          if (err) reject(err)
                          else {
                            submissionDetails._submissionDate = _timeSubmitted
                            console.log(submissionDetails)
                            resolve(submissionDetails)
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
