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
const tournamentAbi = require('../../../data/abi/v2/tournament')
const submissionAbi = require('../../../data/abi/v2/submission')
const roundAbi = require('../../../data/abi/v2/round')

/*
 Attach to the RPC
*/
// @Dev local
// const web3 = new Web3('http://localhost:8545')

let web3 = new Web3()
// web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'))
let web3Provider = 'http://customrpc.matryx.ai:8545'

web3.setProvider(new web3.providers.HttpProvider(web3Provider)) // Elastic IP Address -> http://52.8.65.20:8545
console.log('Connected to: ' + web3Provider)
// TODO switch to config variable
// @Dev prod env
// const web3 = new Web3(proccess.env.WEB3_PROVIDER)

matryxPlatformAddress = currentPlatformInfo.address
matryxPlatformAbi = currentPlatformInfo.abi

console.log('Current Matryx Platform Address in use: \'' + matryxPlatformAddress + '\'')
// matryxPlatformContract = new web3.eth.contract(matryxPlatformAbi, matryxPlatformAddress)
// console.log(matryxPlatformContract)
// @Dev for terminal javascript console geth ->
matryxPlatformContract = web3.eth.contract(matryxPlatformAbi).at(matryxPlatformAddress)

// TODO remove these after development
// console.log(matryxPlatformContract.tournamentCount().call()) // fails "TypeError: this.provider.send is not a function"
// console.log(matryxPlatformContract.methods.tournamentCount().call()) // ^TypeError: Cannot read property 'tournamentCount' of undefined
// console.log(matryxPlatformContract.owner())
console.log(matryxPlatformContract.tournamentCount().c)

// TODO Error handling when no chain is attached ^

var platformCalls = {}

/*
Tournament Calls
*/

platformCalls.getTournamentCount = function () {
  return new Promise((resolve, reject) => {
    matryxPlatformContract.tournamentCount((err, res) => {
      if (err) reject(err)
      else {
        resolve(parseInt(res))
      }
    })
  })
}

platformCalls.getAllTournaments = function () {
  return new Promise((resolve, reject) => {
      // Setup the array for the tournaments
    var allTournaments = []
    matryxPlatformContract.tournamentCount((err, _tournamentCount) => {
        // for loop over the number of tournaments in _tournamentCount
      for (let i = 0; i < _tournamentCount; i++) {
        let allTournamentsDTO = {
          tournamentTitle: '',
          mtx: 0,
          tournamentDescription: '',
          category: '',
          totalRounds: 0,
          currentRound: 0,
          numberOfParticipants: 0,
          address: '',
          ipType: '',
          tournamentID: 0,
          externalAddress: ''
        }
        matryxPlatformContract.allTournaments(i, (err, _tournamentAddress) => {
          if (err) reject(err)
          else {
            allTournamentsDTO.address = _tournamentAddress
            tournamentContract = web3.eth.contract(tournamentAbi).at(_tournamentAddress)
            tournamentContract.BountyMTX((err, _mtx) => {
              if (err) reject(err)
              else {
                allTournamentsDTO.mtx = _mtx.c[0]
                // console.log(allTournamentsDTO)
                tournamentContract.getExternalAddress((err, _externalAddress) => {
                  if (err) reject(err)
                  else {
                    allTournamentsDTO.externalAddress = _externalAddress
                    tournamentContract.currentRound((err, _currentRound) => {
                      if (err) reject(err)
                      else {
                        allTournamentsDTO.currentRound = _currentRound[0]
                        tournamentContract.submissionCount((err, _count) => {
                          if (err) reject(err)
                          else {
                            allTournamentsDTO.numberOfParticipants = _count
                            allTournaments.push(allTournamentsDTO)
                            console.log('The length of the array is:' + allTournaments.length)

                            if (i == _tournamentCount - 1) {
                              resolve(allTournaments)
                            }
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
"tournamentTitle": "Solve Aids",
        "tournamentAddress": "0xe665Dd2C090c7ceFD5C40cb9de00830108A62722",
        "mtx": "200000.00000",
        "authorName": "0xe665Dd2C090c7ceFD5C40cb9de00830108A62785",
        "tournamentDescription": "A description of the tournament",
        "category": "Pharma",
        "totalRounds": "3",
        "currentRound": "1",
        "numberOfParticipants": "130",
        "ipType": "50/50",
        "roundEndTime": "1519427539",
        "participationMTX": "400",
        "roundReward": "20000",
        "recentSubmissions": [
            {
                "submissionTitle": "SubmissionTitle1",
                "authorName": "0xe665Dd2C090c7ceFD5C40cb9de00830108A62785",
                "submissionDate": "1519427539"
            },
            {
                "submissionTitle": "SubmissionTitle2",
                "authorName": "0xe665Dd2C090c7ceFD5C40cb9de00830108A62785",
                "submissionDate": "1519427539"
            },
            {
                "submissionTitle": "SubmissionTitle3",
                "authorName": "0xe665Dd2C090c7ceFD5C40cb9de00830108A62785",
                "submissionDate": "1519427539"
            }
        ]
*/

// TODO currently only returns tournament owner, needs to return all tournament info
platformCalls.getTournamentByAddress = function (_tournamentAddress) {
  return new Promise((resolve, reject) => {
      // Setup the DTO for the tournament
    let tournamentDetails = {
      tournamentTitle: '',
      tournamentAddress: '',
      mtx: 0,
      authorName: '',
      tournamentDescription: '',
      category: '',
      totalRounds: 0,
      currentRound: 0,
      numberOfParticipants: '',
      ipType: '',
      roundEndTime: '',
      participationMTX: 0,
      roundReward: 0,
      recentSubmissions: [],
      externalAddress: ''
    }

    tournamentContract = web3.eth.contract(tournamentAbi).at(_tournamentAddress)
    tournamentContract.BountyMTX((err, _mtx) => {
      if (err) reject(err)
      else {
        tournamentDetails.tournamentAddress = _tournamentAddress
        tournamentDetails.mtx = _mtx.c[0]
        // console.log(allTournamentsDTO)
        tournamentContract.getExternalAddress((err, _externalAddress) => {
          if (err) reject(err)
          else {
            tournamentDetails.externalAddress = _externalAddress
            tournamentContract.maxRounds((err, _maxRounds) => {
              if (err) reject(err)
              else {
                tournamentDetails.totalRounds = _maxRounds
                tournamentContract.submissionCount((err, _count) => {
                  if (err) reject(err)
                  else {
                    tournamentDetails.numberOfParticipants = _count
                    tournamentContract.owner((err, _owner) => {
                      if (err) reject(err)
                      else {
                        tournamentDetails.authorName = _owner
                        tournamentContract.entryFee((err, _fee) => {
                          if (err) reject(err)
                          else {
                            tournamentDetails.participationMTX = _fee
                            tournamentContract.currentRound((err, _currentRound) => {
                              if (err) reject(err)
                              else {
                                tournamentDetails.currentRound = _currentRound[0]
                                if (_currentRound[1] == '0x') {
                                  resolve(tournamentDetails)
                                } else {
                                  roundContract = web3.eth.contract(roundAbi).at(_currentRound[1])
                                  roundContract.endTime((err, _endTime) => {
                                    if (err) reject(err)
                                    else {
                                      tournamentDetails.roundEndTime = _endTime
                                      console.log(_currentRound[1])
                                      resolve(tournamentDetails)
                                    }
                                  })
                                }
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
  })
}

// TODO get Tournament Details by ID

platformCalls.getTournamentOwnerByAddress = function (_tournamentAddress) {
  return new Promise((resolve, reject) => {
    console.log('Starting the tournament contract attachment at address: ' + _tournamentAddress)
    tournamentContract = web3.eth.contract(tournamentAbi).at(_tournamentAddress)
    tournamentContract.owner((err, res) => {
      if (err) reject(err)
      else {
        console.log(res)
        resolve(res)
      }
    })
  })
}

// TODO resolve when ID is implemented
// platformCalls.getTournamentOwnerById = function (_tournament_id) {
//   return new Promise((resolve, reject) => {
//     matryxPlatformContract.allTournaments(_tournament_id, (err, _tournamentAddress) => {
//       if (err) reject(err)
//       else {
//         tournamentContract = web3.eth.contract(tournamentAbi).at(_tournamentAddress)
//         tournamentContract.owner((err, res) => {
//           console.log('response is a' + typeof res) // output is a string
//           if (err) reject(err)
//           else {
//             resolve({
//               tournamentOwner: res,
//               tournamentId: _tournament_id,
//               tournamentAddress: _tournamentAddress
//             })
//           }
//         })
//       }
//     })
//   })
// }

// Get the submission count for the tournament given the tournament address
platformCalls.getSubmissionCount = function (_tournamentAddress) {
  return new Promise((resolve, reject) => {
    tournamentContract = web3.eth.contract(tournamentAbi).at(_tournamentAddress)
    tournamentContract.submissionCount((err, res) => {
      if (err) reject(err)
      else {
        console.log('There are ' + res + ' submissions for the tournament at address: ' + _tournamentAddress)
        resolve(res)
      }
    })
  })
}

// Activity Code

/* Working Event example */
/*
eventFunction()
function eventFunction () {
  matryxPlatformContract.allEvents({fromBlock: 0x0, toBlock: 'latest'}).get((err, event) => {
    console.log(event)
  })
  // console.log(events.get())
}

*/

platformCalls.getPlatformActivity = function () {
  return new Promise((resolve, reject) => {
    let activityEvents = []

        // Make the Platform activity call
    matryxPlatformContract.allEvents({fromBlock: 0x0, toBlock: 'latest'}).get((err, events) => {
      var activityResponse = {
        news: ''
      }
      // Dictionary for event types for switch case
      let eventDict = {
        TournamentCreated: 0,
        TournamentOpened: 1
      }

      events.forEach((event_i) => {
          // TODO Fix the switch case, it currently only spits out case 1 regardless of case. Could be break spacing due to linter.
        switch (eventDict[event_i.event]) {
          case 0:
            {
              activityResponse.news = event_i.args._owner + ' created a new Tournament named ' + '\'' + event_i.args._tournamentName + '\''
              break
            }
          case 1:
            {
              activityResponse.news = event_i.args._owner + ' opened their Tournament named ' + '\'' + event_i.args._tournamentName + '\''
              break
            }
          case 2:
            {
              console.log('Case should be 2. It is actually: ' + eventDict[event_i.event])
              break
            }
          default:
            console.log('This event type does not match our records...Something bad happened...')
        }
        activityEvents.push(activityResponse)
      })
      console.log(activityEvents)
      resolve(activityEvents)
    })
  })
}

// Max's psuedo code
// platformCalls.activity = function () {
//   return new Promise((resolve, reject) => {
//         // "news": "0xb794f5ea0ba39494ce839613fffba74279579268 created a new bounty: \"Solve Diabetes\""
//
//     var news = {activity: []}
//     matryxPlatformContract.TournamentCreated((error, event) => {
//       if (error) {
//         console.log('Error with setting up event: ' + error)
//       } else {
//         console.log('Set up queryPerformed event: ' + event)
//       }
//     })
//         .on('data', (event) => {
//         // event TournamentCreated(bytes32 _discipline, address _owner, address _tournamentAddress, string _tournamentName, bytes32 _externalAddress, uint256 _MTXReward, uint256 _entryFee);
//
//           var discipline = event.returnValues[0]
//           var owner = event.returnValues[1]
//           var tournamentName = event.returnValues[3]
//
//           var message = owner + ' created a new bounty ' + tournamentName
//          // var messageWithDiscipline = owner + " created a new " + discipline + " bounty " + tournamentName;
//           console.log('news:' + message)
//         }).on('changed', function (event) {
//            // remove event from local database
//         }).on('error', function (error) {
//           console.log('error in jsoncreator.js: ' + error)
//         })
//
//         // "news": "0xb794f5ea0ba39494ce839613fffba74279579268 got rewarded 400 MTX"
//     matryxPlatformContract.TournamentClosed(null, (error, event) => {
//       if (error) {
//         console.log('Error with setting up event: ' + error)
//       } else {
//         console.log('Set up queryPerformed event: ' + event)
//       }
//     }).on('data', (event) => {
//          // event TournamentClosed(address _tournamentAddress, uint256 _finalRoundNumber, uint256 _winningSubmissionAddress);
//       var tournamentAddress = event.returnValues[0]
//       var winningSubmissionAddress = event.returnValues[2]
//       var submission = web3.eth.contract(matryxSubmissionABI).at(winningSubmissionAddress)
//
//       submission.getBalance().then((receipt) => {
//         var rewardAmount = receipt
//
//         var message = winningSubmissionAddress + ' got rewarded ' + rewardAmount + ' MTX'
//         console.log('news:' + message)
//       })
//     }).on('changed', function (event) {
//            // remove event from local database
//     }).on('error', function (error) {
//       console.log('error in jsoncreator.js: ' + error)
//     })
//
//         // "news": "0xb794f5ea0ba39494ce839613fffba74279579268 entered tournament: \"Erotic Greek Sculpture\""
//     matryxPlatformContract.UserEnteredTournament(null, (error, event) => {
//       if (error) {
//         console.log('Error with setting up event: ' + error)
//       } else {
//         console.log('Set up queryPerformed event: ' + event)
//       }
//     }).on('data', (event) => {
//          // event UserEnteredTournament(address _entrant, address _tournamentAddress);
//       var entrant = event.returnValues[0]
//       var tournamentAddress = event.returnValues[1]
//       var tournament = web3.eth.contract(matryxTournamentABI).at(matryxTournamentAddress)
//       tournament.send().then((receipt) => {
//         var tournamentName = receipt
//
//         var message = entrant + ' entered tournament ' + tournamentName
//         console.log('news:' + message)
//       })
//     }).on('changed', function (event) {
//            // remove event from local database
//     }).on('error', function (error) {
//       console.log('error in jsoncreator.js: ' + error)
//     })
//   }
// )
// }

/*
Logic for View all tournaments max psuedocode
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

// TODO:  add a round details response for both round address and id given a tournament address

/*
// TODO: add the following after talking to max
_title: '',
_description: '',
_submissions: []

*/
// TODO:
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

    tournamentContract = web3.eth.contract(tournamentAbi).at(_tournamentAddress)
    tournamentContract.currentRound((err, _currentRoundInfo) => {
      if (err) reject(err)
      else {
        currentRoundResponse._currentRound = _currentRoundInfo[0]
        currentRoundResponse._roundAddress = _currentRoundInfo[1]

        roundContract = web3.eth.contract(roundAbi).at(_currentRoundInfo[1])

        roundContract.bountyMTX((err, _bounty) => {
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

/*
{
  'submissionTitle': "Sam's Submission",
  'submissionAddress': '0x15528Fc3CFf56b4667f988C699ec5983030Ce841',
  'submissionAuthor': '0x15528Fc3CFf56b4667f988C699ec5983030Ce842',
  'submissionId': '44',
  'submissionDescription': 'NanoPro is the future',
  'submissionCollaborators': [
    '0x11f2915576Dc51dFFB246959258E8fe5a1913161',
    '0x0327FF417aa111b61bED5F39e77946b38d6592B3'
  ],
  'submissionReferences': [
    '0x0327FF417aa111b61bED5F39e77946b38d6592B3',
    '0x58bA5d062E2c2B14DC8B8458872AFef70A9b25EB'
  ],
  'submissionJson': [
    {
      'Items': [
        '{"rangeKeys":["t","u","v","w"],"rangePairs":[{"min":{"exclusive":false,"rawText":"0"},"max":{"exclusive":false,"rawText":"8*pi"}},{"min":{"exclusive":false,"rawText":"0"},"max":{"exclusive":false,"rawText":"0"}},{"min":{"exclusive":false,"rawText":"0"},"max":{"exclusive":false,"rawText":"0"}},{"min":{"exclusive":false,"rawText":"0"},"max":{"exclusive":false,"rawText":"0"}}],"ExpressionKeys":[0,1,2],"ExpressionValues":["cos(t)*(2-cos(t))","(sin(t))*(2-cos(t))","-sin(2*t)+(cos(t)-.5)"]}'
      ]
    }
  ],
  'submissionIpfsHash': 'QmT9qk3CRYbFDWpDFYeAv8T8H1gnongwKhh5J68NLkLir6',
  'submissionRewardTotal': 1,
  'submissionSelectedRound': 1,
  'submissionDate': '',
  'parentInfo': [
    {
      'currentRound': '1',
      'totalRounds': '3',
      'roundAddress': '0x11f2915576Dc51dFFB246959258E8fe5a1913161',
      'roundMtx': 30,
      'tournamentName': "Sam's Tournament",
      'tournamentAddress': '0x11f2915576Dc51dFFB246959258E8fe5a1913161'
    }
  ]
}
*/

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

// Get the submission details given the submissionAddress
platformCalls.getSubmissionByAddress = function (_submissionAddress) {
  return new Promise((resolve, reject) => {
    var submissionDetails = {
      _submissionTitle: '',
      _submissionAddress: '',
      _submissionAuthor: '',
      _submissionId: 0, // need
      _submissionDescription: '', // need
      _submissionCollaborators: [],
      _submissionReferences: [],
      _submissionJson: [
        {
          _Items: [] // need
        }
      ],
      _submissionIpfsHash: '',
      _submissionRewardTotal: 0, // need
      _submissionSelectedRound: 0, // need
      _submissionDate: '',
      _parentInfo: [
        {
          _currentRound: 0,
          _totalRounds: 0,
          _roundAddress: '',
          _roundMtx: 0,
          _tournamentName: '', // need
          _tournamentAddress: ''
        }
      ]
    }
    submissionContract = web3.eth.contract(submissionAbi).at(_submissionAddress)
    console.log(submissionContract)
    submissionContract.getTitle((err, _title) => {
      if (err) reject(err)
      else {
        submissionDetails._submissionTitle = _title
        submissionDetails._submissionAddress = _submissionAddress

        submissionContract.getAuthor((err, _author) => {
          if (err) reject(err)
          else {
            submissionDetails._submissionAuthor = _author
            submissionContract.getContributors((err, _contributors) => {
              if (err) reject(err)
              else {
                submissionDetails._submissionCollaborators = _contributors
                submissionContract.getReferences((err, _references) => {
                  if (err) reject(err)
                  else {
                    submissionDetails._submissionReferences = _references
                    submissionContract.getTimeSubmitted((err, _timeSubmitted) => {
                      if (err) reject(err)
                      else {
                        submissionDetails._submissionDate = _timeSubmitted
                        submissionContract.getExternalAddress((err, _externalAddress) => {
                          if (err) reject(err)
                          else {
                            submissionDetails._submissionIpfsHash = _externalAddress
                            submissionContract.tournamentAddress((err, _tournamentAddress) => {
                              if (err) reject(err)
                              else {
                                submissionDetails._parentInfo._tournamentAddress = _tournamentAddress
                                tournamentContract = web3.eth.contract(tournamentAbi).at(_tournamentAddress)
                                tournamentContract.currentRound((err, _currentRound) => {
                                  if (err) reject(err)
                                  else {
                                    submissionDetails._parentInfo._currentRound = _currentRound[0]
                                    submissionContract.roundAddress((err, _roundAddress) => {
                                      if (err) reject(err)
                                      else {
                                        submissionDetails._parentInfo._roundAddress = _roundAddress
                                        roundContract = web3.eth.contract(roundAbi).at(_roundAddress)
                                        roundContract.bountyMTX((err, _bountyMTX) => {
                                          if (err) reject(err)
                                          else {
                                            submissionDetails._parentInfo._roundMtx = _bountyMTX
                                            tournamentContract.maxRounds((err, _maxRounds) => {
                                              if (err) reject(err)
                                              else {
                                                submissionDetails._parentInfo._totalRounds = _maxRounds
                                        // console.log(submissionDetails)
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

// TODO: Verify that owner() is a function
platformCalls.getSubmissionOwnerByAddress = function (_submissionAddress) {
  return new Promise((resolve, reject) => {
    console.log('Starting the submission contract attachment at address: ' + _submissionAddress)
    submissionContract = web3.eth.contract(submissionAbi).at(_submissionAddress)
    submissionContract.getAuthor((err, res) => {
      if (err) reject(err)
      else {
        console.log(res)
        resolve(res)
      }
    })
  })
}

module.exports = platformCalls
