const router = require('express').Router()
const Joi = require('joi')
const db = require('../dbService')
const jsonParse = require('../middleware/jsonParse') // For cross-origin cookies. Must accept String or FormData
const confirmSignature = require('../middleware/signature')
const asyncWrap = require('../middleware/asyncWrap')

function objToLowerCase(obj = {}, specificKeys = []) {
  return Object.keys(obj).reduce((newObj, currentKey) => {
    const value = obj[currentKey]
    if (specificKeys.length && !specificKeys.includes(currentKey)) {
      return newObj
    }
    if (typeof value !== 'string') {
      return newObj
    }
    newObj[currentKey] = value.toLowerCase()
    return newObj
  }, obj)
}

function validate(input, schema) {
  return Joi.attempt(input, schema, { abortEarly: false })
}

const validWeb3Address = Joi.string().trim().length(42)
const validDirection = Joi.string().trim().default('').allow('up', 'down', '')

function getVotes(whereParams = {}) {
  let query = db('vote').select('voter', 'recipient', 'direction')
  const allowedParams = ['voter', 'recipient', 'direction']
  const whereClause = Object.keys(whereParams).reduce((newObj, currentKey) => {
    const value = whereParams[currentKey]
    if (allowedParams.includes(currentKey) && !!value) {
      newObj[currentKey] = value
    }
    return newObj
  }, {})
  if (Object.keys(whereClause).length) {
    query = query.where(whereClause)
  }
  return query
}

router.get('/', asyncWrap(async (req, res) => {
  const args = validate(req.args, {
    voter: validWeb3Address,
    recipient: validWeb3Address,
    direction: validDirection
  })
  const whereParams = objToLowerCase(args)

  const r = await getVotes(whereParams)
  res.json({
    succes: true,
    results: r
  })
}))

router.post('/', jsonParse, confirmSignature, asyncWrap(async (req, res) => {
  const input = {
    voter: req.web3Address,
    recipient: req.body.recipient, // Must use req body because it's JSON string due to cross-origin cookie thing
    direction: req.body.direction, // Must use req body because it's JSON string due to cross-origin cookie thing
  }
  const args = validate(input, {
    voter: validWeb3Address.required(),
    recipient: validWeb3Address.required(),
    direction: validDirection
  })
  const { voter, recipient, direction } = objToLowerCase(args)

  const table = db('vote')
  const query = table.where({
    voter,
    recipient,
  })
  const results = await query

  if (!direction) {
    await query.del()
  } else {
    if (results.length) {
      await query.update({
        direction
      })
    } else {
      await table.insert({
        voter,
        recipient,
        direction
      })
    }
  }

  res.status(200).json({
    success: true,
    results: {
      voter,
      recipient,
      direction: direction
    }
  })
}))

module.exports = router
