const externalApiCalls = require('../controllers/gateway/externalApiCalls')

const version = process.env.PLATFORM_VERSION
const networkId = process.env.NETWORK_ID

let platform, tournament, round, submission

module.exports = new Promise(async (resolve, reject) => {
  const platform = await externalApiCalls
    .getMatryxPlatformInfo(version)
    .then(result => {
      let address = result['networks'][networkId]['address']
      let abi = result.abi
      return { address, abi }
    })
    .catch(err => console.log('Unable to retrieve Platform ABI', err))

  const tournament = await externalApiCalls
    .getMatryxTournamentAbi(version)
    .then(({ abi }) => ({ abi }))
    .catch(err => console.log('Unable to retrieve Tournament ABI', err))

  const round = await externalApiCalls
    .getMatryxRoundAbi(version)
    .then(({ abi }) => ({ abi }))
    .catch(err => console.log('Unable to retrieve Round ABI', err))

  const submission = await externalApiCalls
    .getMatryxSubmissionAbi(version)
    .then(({ abi }) => ({ abi }))
    .catch(err => console.log('Unable to retrieve Submission ABI', err))

  resolve({
    platform,
    tournament,
    round,
    submission
  })
})
