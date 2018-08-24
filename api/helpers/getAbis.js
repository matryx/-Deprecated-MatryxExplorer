const externalApiCalls = require('../controllers/gateway/externalApiCalls')

const version = process.env.PLATFORM_VERSION
const networkId = process.env.NETWORK_ID

module.exports = new Promise(async (resolve, reject) => {
  const platformPromise = externalApiCalls
    .getMatryxPlatformInfo(version)
    .then(result => {
      let address = result['networks'][networkId]['address']
      let abi = result.abi
      return { address, abi }
    })
    .catch(err => console.log('Error getting Platform ABI', err))

  const tournamentPromise = externalApiCalls
    .getMatryxTournamentAbi(version)
    .catch(err => console.log('Error getting Tournament ABI', err))

  const roundPromise = externalApiCalls
    .getMatryxRoundAbi(version)
    .catch(err => console.log('Error getting Round ABI', err))

  const submissionPromise = externalApiCalls
    .getMatryxSubmissionAbi(version)
    .catch(err => console.log('Error getting Submission ABI', err))

  const [platform, tournament, round, submission] = await Promise.all([
    platformPromise,
    tournamentPromise,
    roundPromise,
    submissionPromise
  ])

  resolve({
    platform,
    tournament,
    round,
    submission
  })
})
