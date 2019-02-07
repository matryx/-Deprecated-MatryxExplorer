const Joi = require('joi')
const db = require('./index')

function objToLowerCase(oldObj = {}, specificKeys = []) {
  return Object.keys(oldObj).reduce((newObj, currentKey) => {
    if (specificKeys.length && !specificKeys.includes(currentKey)) {
      return newObj
    }
    const value = oldObj[currentKey]
    if (typeof value !== 'string') {
      return newObj
    }
    newObj[currentKey] = value.toLowerCase()
    return newObj
  }, oldObj)
}

function validate(input, schema) {
  return Joi.attempt(input, schema, { abortEarly: false })
}
const validEthAddress = Joi.string().trim().regex(/^0x[0-9A-Fa-f]{40}$/)
const validDirection = Joi.string().trim().valid('up', 'down', '', null).default('')

module.exports = {
  getVotes(params) {
    const cleaned = validate(params, {
      voter: validEthAddress,
      recipient: validEthAddress,
      direction: validDirection
    })
    const whereParams = objToLowerCase(cleaned)

    let query = db('vote').select('voter', 'recipient', 'direction')

    const whereClause = Object.keys(whereParams).reduce((newObj, currentKey) => {
      const value = whereParams[currentKey]
      if (!!value) {
        newObj[currentKey] = value
      }
      return newObj
    }, {})

    if (Object.keys(whereClause).length) {
      query = query.where(whereClause)
    }
    return query
  },

  async getVoteDistribution(params) {
    const cleaned = validate(params, {
      recipient: validEthAddress.required()
    })
    const { recipient } = objToLowerCase(cleaned)

    const [votesUpResults, votesDownResults] = await Promise.all([
      db('vote').where({ recipient, direction: 'up' }).count(),
      db('vote').where({ recipient, direction: 'down' }).count()
    ])
    // SQLite returns [ { 'count(*)': 2 } ] while Postgres returns [ { count: 2 } ]
    const isSqlite = typeof votesUpResults[0]['count(*)'] !== 'undefined'
    const countKey = isSqlite ? 'count(*)' : 'count'

    return {
      up: votesUpResults[0][countKey],
      down: votesDownResults[0][countKey]
    }
  },

  async castVote(params) {
    const cleaned = validate(params, {
      voter: validEthAddress.required(),
      recipient: validEthAddress.required(),
      direction: validDirection
    })
    const { voter, recipient, direction } = objToLowerCase(cleaned)

    const query = db('vote').where({
      voter,
      recipient,
    })
    const results = await query

    if (!direction) {
      return query.del()
    }
    if (results.length) {
      return query.update({
        direction
      })
    }
    return db('vote').insert({
      voter,
      recipient,
      direction
    })
  }
}
