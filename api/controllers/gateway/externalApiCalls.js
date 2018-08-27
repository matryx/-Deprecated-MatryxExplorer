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
  platform: 'MatryxPlatform.json',
  token: 'MatryxToken.json',
  tournament: 'MatryxTournament.json',
  submission: 'MatryxSubmission.json',
  round: 'MatryxRound.json'
}

const getInfo = async (contract, branch) => {
  const url = contractUrl(branch) + ABIs[contract]
  const res = await fetch(url)

  if (res.status !== 200) {
    throw Error(`Error getting ${contract} ABI`)
  }

  console.log(`Got ${contract} ABI from MatryxPlatform GitHub for ${branch}`)
  return res.json()
}

externalApiCalls.getMatryxPlatformInfo  = branch => getInfo('platform', branch)
externalApiCalls.getMatryxTokenInfo     = branch => getInfo('token', branch)
externalApiCalls.getMatryxTournamentAbi = branch => getInfo('tournament', branch)
externalApiCalls.getMatryxSubmissionAbi = branch => getInfo('submission', branch)
externalApiCalls.getMatryxRoundAbi      = branch => getInfo('round', branch)

module.exports = externalApiCalls
