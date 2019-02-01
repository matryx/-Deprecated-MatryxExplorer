/**
 * getAbis.js
 * Helper file for getting current ABIs for use throughout the app
 *
 * Authors dev@nanome.ai
 * Copyright (c) 2018, Nanome Inc
 * Licensed under ISC. See LICENSE.md in project root
 */

const EventEmitter = require('events')
const MatryxSystem = require('../contracts/MatryxSystem')
const MatryxPlatform = require('../contracts/MatryxPlatform')

const networkId = process.env.NETWORK_ID || "3"
const branch = process.env.ARTIFACTS_BRANCH || "staging"

const contractUrl = branch => `https://raw.githubusercontent.com/matryx/MatryxPlatformArtifacts/${branch}/artifacts/`

const loadArtifact = async name => {
  const url = contractUrl(branch) + `${name}.json`
  const res = await fetch(url)

  if (!res.ok) {
    throw new Error(`Error getting ${name} ABI`)
  }

  console.log(`Got ${name} from Artifacts GitHub`)

  return res.json()
}

class ABIs extends EventEmitter {
  constructor() {
    super()

    this.updateInProgress = false
    this.lastUpdate = null
    this.system = null
    this.user = null
    this.platform = null
    this.commit = null
    this.tournament = null
    this.round = null

    this.loadedAbis = new Promise(async done => {
      await this.update()
      done()
    })
  }

  async attemptUpdate () {
    const { updatedAt } = await loadArtifact('Migrations')
    if (this.lastUpdate === updatedAt || this.updateInProgress) return false

    await this.update()
    return true
  }

  async update () {
    this.updateInProgress = true

    try {
      const jsons = await Promise.all([
        loadArtifact('MatryxToken'),
        loadArtifact('MatryxSystem'),
        loadArtifact('IMatryxUser'),
        loadArtifact('IMatryxPlatform'),
        loadArtifact('IMatryxCommit'),
        loadArtifact('IMatryxTournament'),
        loadArtifact('IMatryxRound'),
        loadArtifact('Migrations')
      ])

      const [
        token, system, user, platform, commit, tournament, round, migrations
      ] = jsons

      const artifacts = {
        token,
        system,
        user,
        platform,
        commit,
        tournament,
        round
      }

      const systemAddress = system.networks[networkId].address
      const System = new MatryxSystem(systemAddress, system.abi)

      // TODO: put in .env
      const version = 1 // await system.getVersion()
      const [userAddress, platformAddress, commitAddress] = await Promise.all([
        System.getContract(version, 'MatryxUser'),
        System.getContract(version, 'MatryxPlatform'),
        System.getContract(version, 'MatryxCommit')
      ])

      const abis = {}
      Object.entries(artifacts).forEach(([name, artifact]) => {
        abis[name] = { abi: artifact.abi }
      })

      const Platform = new MatryxPlatform(platformAddress, platform.abi)
      const tokenAddress = (await Platform.getInfo()).token

      abis.token.address = tokenAddress
      abis.system.address = systemAddress
      abis.user.address = userAddress
      abis.platform.address = platformAddress
      abis.commit.address = commitAddress
      Object.assign(this, abis)

      this.lastUpdate = migrations.updatedAt
      this.emit('update', this)
    } catch (err) {
      throw err
    } finally {
      this.updateInProgress = false
    }
  }
}

module.exports = new ABIs()
