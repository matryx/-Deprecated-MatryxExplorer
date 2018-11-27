/**
 * tournamentController.js
 * Helper methods for getting Tournament data
 *
 * Authors sam@nanome.ai dev@nanome.ai
 * Copyright (c) 2018, Nanome Inc
 * Licensed under ISC. See LICENSE.md in project root.
 */

const ipfsCalls = require('./gateway/ipfsCalls')

const MatryxTournament = require('../contracts/MatryxTournament')
const MatryxRound = require('../contracts/MatryxRound')
const MatryxSubmission = require('../contracts/MatryxSubmission')

const abis = require('../helpers/getAbis')
const contracts = require('../helpers/getContracts')

let tournamentController = {}

tournamentController.count = () => {
  const Platform = contracts.platform
  return Platform.getTournamentCount()
}

tournamentController.getTournaments = async (query) => {
  const User = contracts.user
  const Platform = contracts.platform

  // default to getting first 20 Tournaments
  const params = { startIndex: 0, count: 20, ...query }

  let addresses
  if (params.owner) {
    addresses = await User.getTournaments(params.owner)
  } else {
    addresses = await Platform.getTournaments(params.startIndex, params.count)
  }

  let promises = addresses.map(async address => {
    const Tournament = new MatryxTournament(address, abis.tournament.abi)

    // let ts = Date.now()
    const data = await Promise.all([
      Tournament.getDetails(),
      Tournament.getOwner(),
      Tournament.getState(),
      Tournament.getCurrentRound(),
      Tournament.getEntrantCount(),
      Tournament.getSubmissionCount()
    ])
    // console.log(address, 'took', Date.now() - ts, 'ms')

    const [
      details,
      owner,
      state,
      currentRound,
      entrantCount,
      submissionCount
    ] = data

    const {
      title,
      category,
      descHash,
      fileHash,
      bounty,
      entryFee
    } = details

    const description = await ipfsCalls.getIpfsFile(descHash)

    return {
      address,
      owner,
      title,
      description,
      fileHash,
      category,
      state,
      bounty,
      entryFee,
      ipType: '',
      currentRound: currentRound.id,
      entrantCount,
      submissionCount
    }
  })

  return await Promise.all(promises)
}

// TODO: submissions call
// TODO: getDescription only when max gives back a correct hash-> also error handle for this.

tournamentController.getTournamentByAddress = async (address) => {
  const Tournament = new MatryxTournament(address, abis.tournament.abi)

  const data = await Promise.all([
    Tournament.getDetails(),
    Tournament.getOwner(),
    Tournament.getBalance(),
    Tournament.getState(),
    Tournament.getCurrentRound(),
    Tournament.getEntrantCount(),
    Tournament.getSubmissionCount(),
    Tournament.getRounds()
  ])

  const [
    details,
    owner,
    remainingMtx,
    state,
    currentRoundData,
    entrantCount,
    submissionCount,
    rounds
  ] = data

  const {
    category,
    title,
    descHash,
    fileHash,
    bounty,
    entryFee
  } = details

  const currentRound = currentRoundData.id
  const currentRoundAddress = currentRoundData.address

  const Round = new MatryxRound(currentRoundAddress, abis.round.abi)

  const [
    description,
    currentRoundState,
    roundEndTime,
  ] = await Promise.all([
    ipfsCalls.getIpfsFile(descHash),
    Round.getState(),
    Round.getEnd()
  ])

  // get previous round winners
  const winnersPromises = rounds.map(async rAddress => {
    const Round = new MatryxRound(rAddress, abis.round.abi)

    const winningSubs = await Round.getWinningSubmissions()
    const winningSubPromises = winningSubs.map(async sAddress => {
      const Submission = new MatryxSubmission(sAddress, abis.submission.abi)

      const [title, reward] = await Promise.all([
        Submission.getTitle(),
        Submission.getTotalWinnings()
      ])

      return { address: sAddress, title, reward }
    })

    return await Promise.all(winningSubPromises)
  })

  const winners = await Promise.all(winnersPromises)

  return {
    address,
    owner,
    title,
    description,
    fileHash,
    category,
    bounty,
    remainingMtx,
    entryFee,
    ipType: '',
    state,
    currentRound,
    currentRoundAddress,
    currentRoundState,
    roundEndTime,
    entrantCount,
    submissionCount,
    winners
    // submissions
  }
}

tournamentController.getTournamentOwnerByAddress = (tournamentAddress) => {
  const Tournament = new MatryxTournament(tournamentAddress, abis.tournament.abi)
  return Tournament.getOwner()
}

tournamentController.getSubmissionCount = (tournamentAddress) => {
  const Tournament = new MatryxTournament(tournamentAddress, abis.tournament.abi)
  return Tournament.getSubmissionCount()
}

tournamentController.getCurrentRound = async (tournamentAddress) => {
  const Tournament = new MatryxTournament(tournamentAddress, abis.tournament.abi)
  const currentRoundData = await Tournament.getCurrentRound()
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

// roundId-1 here because ID is 1-based, index is 0-based
tournamentController.getRoundAddress = async (tournamentAddress, roundId) => {
  const rounds = await tournamentController.getAllRoundAddresses(tournamentAddress)
  return rounds[roundId - 1]
}

tournamentController.getTournamentsByCategory = (category) => {
  const Platform = contracts.platform
  return Platform.getTournamentsByCategory(category)
}

module.exports = tournamentController
