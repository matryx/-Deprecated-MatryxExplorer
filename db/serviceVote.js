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
const validWeb3Address = Joi.string().trim().length(42)
const validDirection = Joi.string().trim().default('').allow('up', 'down', '')

module.exports = {
  getVotes(params) {
    const cleaned = validate(params, {
      voter: validWeb3Address,
      recipient: validWeb3Address,
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

  async castVote(params) {
    const cleaned = validate(params, {
      voter: validWeb3Address.required(),
      recipient: validWeb3Address.required(),
      direction: validDirection
    })
    const { voter, recipient, direction } = objToLowerCase(cleaned)

    const table = db('vote')
    const query = table.where({
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
    return table.insert({
      voter,
      recipient,
      direction
    })
  }
}
