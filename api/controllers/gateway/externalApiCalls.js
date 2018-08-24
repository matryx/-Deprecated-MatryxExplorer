/*
The Matryx Platform Smart Contract interaction file

authors - sam@nanome.ai
Nanome 2018
*/
'use strict'

let contractUrl = branch => `https://raw.githubusercontent.com/matryx/MatryxPlatform/${branch}/build/contracts/`
// let contractUrl = branch => `http://localhost:8081/`

let externalApiCalls = {}

const ABIs = {
  'platform': {
    v1: '../../../data/abi/v1/platform',
    v2: '../../../data/abi/v2/platform',
    json: 'MatryxPlatform.json'
  },
  'token': { json: 'MatryxToken.json' },
  'tournament': {
    v2: '../../../data/abi/v2/tournament',
    json: 'MatryxTournament.json'
  },
  'submission': {
    v2: '../../../data/abi/v2/submission',
    json: 'MatryxSubmission.json'
  },
  'round': {
    v2: '../../../data/abi/v2/round',
    json: 'MatryxRound.json'
  }
}

const getInfo = async (contract, branch) => {
  if (branch === 'v1' || branch === 'v2') {
    let path = ABIs[contract][branch]
    if (path !== undefined) {
      return require(path)
    } else {
      throw Error(branch + ' ABI does not exist for ' + contract)
    }
  } else {
    let url = contractUrl(branch) + ABIs[contract].json
    let res = await fetch(url)

    if (res.status !== 200) {
      throw Error(`Error getting ${contract} ABI`)
    }

    console.log('Got ' + contract + ' ABI from MatryxPlatform GitHub for ' + branch)
    return res.json()
  }
}

externalApiCalls.getMatryxPlatformInfo  = branch => getInfo('platform', branch)
externalApiCalls.getMatryxTokenInfo     = branch => getInfo('token', branch)
externalApiCalls.getMatryxTournamentAbi = branch => getInfo('tournament', branch)
externalApiCalls.getMatryxSubmissionAbi = branch => getInfo('submission', branch)
externalApiCalls.getMatryxRoundAbi      = branch => getInfo('round', branch)

module.exports = externalApiCalls
