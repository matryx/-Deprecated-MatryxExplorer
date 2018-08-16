/*
The Matryx Tournament controller

authors - sam@nanome.ai
Nanome 2018
*/

/*
Imports
*/

const ipfsCalls = require('./gateway/ipfsCalls')

const MatryxPlatform = require('../contracts/MatryxPlatform')
const MatryxTournament = require('../contracts/MatryxTournament')
const MatryxRound = require('../contracts/MatryxRound')

let Platform, abis
require('../helpers/getAbis').then(a => {
  abis = a
  Platform = new MatryxPlatform(abis.platform.address, abis.platform.abi)
})

let tournamentController = {}

tournamentController.count = () => {
  return Platform.getTournamentCount()
}

tournamentController.getAllTournaments = async (query) => {
  // Get all the tournament addresses
  let addresses = await Platform.getTournaments()

  if (query && query.owner) {
    // get all tournament owners, then filter addresses by owner
    let promises = addresses.map(address => (async () => {
      const Tournament = new MatryxTournament(address, abis.tournament.abi)
      let owner = await Tournament.getOwner()
      return { owner, address }
    })())

    let addressesWithOwner = await Promise.all(promises)
    addresses = addressesWithOwner
      .filter(t => t.owner === query.owner)
      .map(t => t.address)
  }

  let promises = addresses.map(address => (async () => {
    const Tournament = new MatryxTournament(address, abis.tournament.abi)

    // TODO: remove either totalRounds or currentRound; they are the same
    // let ts = Date.now()
    const data = await Promise.all([
      Tournament.getData(),
      Tournament.getOwner(),
      Tournament.getBounty(),
      Tournament.getState(),
      Tournament.currentRound(),
      Tournament.entrantCount()
    ])
    // console.log(address, 'took', Date.now() - ts, 'ms')

    const [
      tdata,
      owner,
      bounty,
      state,
      currentRound,
      numberOfParticipants
    ] = data

    const {
      category,
      title,
      descriptionHash,
      fileHash
    } = tdata

    const description = await ipfsCalls.getIpfsFile(descriptionHash)

    return {
      address,
      owner,
      title,
      description,
      fileHash,
      category,
      state,
      bounty,
      ipType: '',
      currentRound: currentRound.id,
      numberOfParticipants
    }
  })())

  return await Promise.all(promises)
}

// TODO: submissions call
// TODO: getDescription only when max gives back a correct hash-> also error handle for this.

tournamentController.getTournamentByAddress = async (address) => {
  console.log('Executing TournamentController for getting Tournament details at: ' + address)

  const Tournament = new MatryxTournament(address, abis.tournament.abi)

  const data = await Promise.all([
    Tournament.getData(),
    Tournament.getOwner(),
    Tournament.getBounty(),
    Tournament.getBalance(),
    Tournament.getState(),
    Tournament.currentRound(),
    Tournament.entrantCount()
  ])

  const [
    tdata,
    owner,
    bounty,
    remainingMtx,
    state,
    currentRoundData,
    numberOfParticipants
  ] = data

  const {
    category,
    title,
    descriptionHash,
    fileHash,
    entryFee
  } = tdata

  const currentRound = currentRoundData.id
  const currentRoundAddress = currentRoundData.address

  const Round = new MatryxRound(currentRoundAddress, abis.round.abi)

  const [
    description,
    currentRoundState,
    roundEndTime,
  ] = await Promise.all([
    ipfsCalls.getIpfsFile(descriptionHash),
    Round.getState(),
    Round.getEndTime()
  ])

  return {
    address,
    owner,
    title,
    description,
    fileHash,
    category,
    ipType: '',
    state,
    bounty,
    remainingMtx,
    currentRound,
    currentRoundAddress,
    currentRoundState,
    roundEndTime,
    numberOfParticipants,
    entryFee
    // submissions
  }
}

tournamentController.getTournamentOwnerByAddress = (tournamentAddress) => {
  const Tournament = new MatryxTournament(tournamentAddress, abis.tournament.abi)
  return Tournament.getOwner()
}

tournamentController.getSubmissionCount = (tournamentAddress) => {
  const Tournament = new MatryxTournament(tournamentAddress, abis.tournament.abi)
  return Tournament.submissionCount()
}

tournamentController.getCurrentRound = async (tournamentAddress) => {
  const Tournament = new MatryxTournament(tournamentAddress, abis.tournament.abi)
  const currentRoundData = await Tournament.currentRound()
  return currentRoundData.id
}

tournamentController.isEntrant = (tournamentAddress, potentialEntrantAddress) => {
  const Tournament = new MatryxTournament(tournamentAddress, abis.tournament.abi)
  return Tournament.isEntrant(potentialEntrantAddress)
}

tournamentController.getAllRoundAddresses = (tournamentAddress) => {
  const Tournament = new MatryxTournament(tournamentAddress, abis.tournament.abi)
  return Tournament.getRounds()
}

// TODO roundId-1 here because ID is 1-based, index is 0-based
tournamentController.getRoundAddress = async (tournamentAddress, roundId) => {
  const rounds = await tournamentController.getAllRoundAddresses(tournamentAddress)
  return rounds[roundId - 1]
}

tournamentController.getTournamentsByCategory = (category) => {
  return Platform.getTournamentsByCategory(category)
}

tournamentController.isCreator = (tournamentAddress, userAddress) => {
  const Tournament = new MatryxTournament(tournamentAddress, abis.tournament.abi)
  return Tournament.isOwner(userAddress)
}

module.exports = tournamentController
