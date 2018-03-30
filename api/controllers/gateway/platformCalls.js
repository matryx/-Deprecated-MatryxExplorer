/*
The Matryx Platform Smart Contract interaction file

authors - sam@nanome.ai
Nanome 2018
*/

/*
Imports
*/

const version = process.env.PLATFORM_VERSION

const Web3 = require('web3')
const config = require('../../../config')
const externalApiCalls = require('./externalApiCalls')
const platformInfo = require('../../../data/abi/' + version + '/platform')
const tournamentAbi = require('../../../data/abi/' + version + '/tournament')
const submissionAbi = require('../../../data/abi/' + version + '/submission')
const roundAbi = require('../../../data/abi/' + version + '/round')
const currentPlatformInfo = require('../../../data/abi/' + version + '/platform')

/*
 Attach to the RPC
*/

let web3 = new Web3()

let web3Provider = process.env.CUSTOMRPC
web3.setProvider(new web3.providers.HttpProvider(web3Provider)) // Elastic IP Address -> http://52.8.65.20:8545

console.log('Connected to: ' + web3Provider)

matryxPlatformAddress = currentPlatformInfo.address
matryxPlatformAbi = currentPlatformInfo.abi

console.log('Current Matryx Platform Address in use: \'' + matryxPlatformAddress + '\'')

matryxPlatformContract = web3.eth.contract(matryxPlatformAbi).at(matryxPlatformAddress)

console.log('There are ' + matryxPlatformContract.tournamentCount().c[0] + ' tournaments on the Platform.')

// TODO Error handling when no chain is attached ^

let platformCalls = {}

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

platformCalls.testPublicVarGetter = function () {
  return new Promise((resolve, reject) => {
    matryxPlatformContract.matryxTokenAddress((err, res) => {
      if (err) reject(err)
      else {
        resolve(res)
      }
    })
  })
}

platformCalls.getAllTournaments = function () {
  return new Promise((resolve, reject) => {
      // Setup the array for the tournaments
    var allTournaments = []
    matryxPlatformContract.tournamentCount((err, _tournamentCount) => {
      console.log('There are this many tournaments: ' + _tournamentCount)
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
            tournamentContract.Bounty((err, _mtx) => {
              if (err) reject(err)
              else {
                allTournamentsDTO.mtx = _mtx.c[0]
                // console.log(allTournamentsDTO)
                tournamentContract.getExternalAddress((err, _externalAddress) => {
                  if (err) reject(err)
                  else {
                    // console.log(_externalAddress)
                    // _externalAddress = web3.toAscii(_externalAddress)
                    // console.log(_externalAddress + 'ends up being this ')
                    allTournamentsDTO.externalAddress = _externalAddress
                    tournamentContract.title((err, _title) => {
                      if (err) reject(err)
                      else {
                        // TODO: for some reason the tournament title changes every time I call it...
                        allTournamentsDTO.tournamentTitle = _title
                        tournamentContract.discipline((err, _category) => {
                          if (err) reject(err)
                          else {
                            // TODO: category is not working?
                            console.log('The category should be: ' + _category)
                            allTournamentsDTO.category = _category
                            tournamentContract.maxRounds((err, _totalRounds) => {
                              if (err) reject(err)
                              else {
                            // console.log(_externalAddress)
                            // _externalAddress = web3.toAscii(_externalAddress)
                            // console.log(_externalAddress + 'ends up being this ')
                                allTournamentsDTO.totalRounds = _totalRounds
                                tournamentContract.currentRound((err, _currentRound) => {
                                  if (err) reject(err)
                                  else {
                                    allTournamentsDTO.currentRound = _currentRound[0].c[0]
                                    tournamentContract.submissionCount((err, _count) => {
                                      if (err) reject(err)
                                      else {
                                        allTournamentsDTO.numberOfParticipants = _count.c[0]
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
    tournamentContract.Bounty((err, _mtx) => {
      if (err) reject(err)
      else {
        tournamentDetails.tournamentAddress = _tournamentAddress
        tournamentDetails.mtx = _mtx.c[0]
        // console.log(allTournamentsDTO)
        tournamentContract.getExternalAddress((err, _externalAddress) => {
          if (err) reject(err)
          else {
            tournamentDetails.externalAddress = web3.toAscii(_externalAddress)
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

                            tournamentContract.title((err, _title) => {
                              if (err) reject(err)
                              else {
                                tournamentDetails.tournamentTitle = _title
                                console.log('The title is: ' + _title)
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

                                          roundContract.bounty((err, _roundBounty) => {
                                            if (err) reject(err)
                                            else {
                                              tournamentDetails.roundReward = _roundBounty

                                              console.log(_currentRound[1])
                                              resolve(tournamentDetails)
                                            }
                                          })
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

// Get the submission count for the tournament given the tournament address
platformCalls.isTournamentEntrant = function (_tournamentAddress, _potentialEntrantAddress) {
  return new Promise((resolve, reject) => {
    tournamentContract = web3.eth.contract(tournamentAbi).at(_tournamentAddress)
    tournamentContract.isEntrant(_potentialEntrantAddress, (err, res) => {
      if (err) reject(err)
      else {
        console.log('The potential entrant at address:  ' + _potentialEntrantAddress + ' at tournament at address: ' + _tournamentAddress + ' is ' + res)
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

/*
{
  'title': 'Suborbital Spaceplane Airfoil Design',
  'bounty': 100,
  'description': 'The process of airfoil design proceeds from a knowledge of \
the relationship between geometry and pressure distribution. Airfoil design is \
application specific. Some airfoils need only to minimize drag force while others \
need to maximize lift. As our aircraft needs to reach upper atmosphere as quickly as \
possible, this tournament focuses on the latter; See Section IV for technical specifications.',
  'submissions':
  [
    {
      'submissionTitle': 'Lift-to-drag maximization for single airfoil at M = 0.63',
      'submissionDate': '1519427539',
      'submissionAddress': '0xa0e239b0abf4582366adaff486ee268c848c4409'
    },
    {
      'submissionTitle': 'High Lift, Low Aspect Ratio Airfoil',
      'submissionDate': '1519427539',
      'submissionAddress': '0x851b7f3ab81bd8df354f0d7640efcd7288553419'
    },
    {
      'submissionTitle': 'Low Reynolds Number Airfoil',
      'submissionDate': '1519427539',
      'submissionAddress': '0x32be343b94f860124dc4fee278fdcbd38c102d88'
    }
  ]
}
*/

// TODO: Implement an open round in order to finish this
platformCalls.getCurrentRoundFromTournamentAddress = function (_tournamentAddress) {
  return new Promise((resolve, reject) => {
    let roundDetails = {
      title: '',
      bounty: 0,
      externalAddress: '',
      submissions:
      []
    }
    let submissionList =
      {
        submissionTitle: '',
        submissionDate: '',
        submissionAddress: ''
      }

    tournamentContract = web3.eth.contract(tournamentAbi).at(_tournamentAddress)
    tournamentContract.currentRound((err, _currentRoundInfo) => {
      if (err) reject(err)
      else {
          // _currentRoundInfo[0]
          // _currentRoundInfo[1]
        if (_currentRoundInfo[1] == '0x') reject(err)
        else {
          roundContract = web3.eth.contract(roundAbi).at(_currentRoundInfo[1])
          roundContract.bountyMTX((err, _bounty) => {
            if (err) reject(err)
            else {
              roundDetails._bounty = _bounty
              roundContract.numberOfSubmission((err, _numberOfSubmissions) => {
                if (err) reject(err)
                else {
                  console.log(_numberOfSubmissions)
                  roundContract.getSubmissions((err, _submissions) => {
                    if (err) reject(err)
                    else {
                      console.log(_submissions)
                      console.log(currentRoundResponse)
                      resolve(currentRoundResponse)
                    }
                  })
                }
              })
            }
          })
        }
      }
    })
  })
}

// TODO: getRoundDetailsFromRIdAndTAD

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
