const { promisify } = require('util');
const Joi = require('joi')
const jwt = require('jsonwebtoken')
const { getUserById } = require('../../db/serviceUser')

const jwtSecret = process.env.JWT_SECRET || 'jwtsecret'

module.exports = async (req, res, next) => {
  try {
    const token = Joi.attempt(req.args.token, Joi.string().required());

    const jwtVerify = promisify(jwt.verify)
    const { id } = await jwtVerify(token, jwtSecret).catch(error => {
      throw new Error('Error authenticating token.')
    })

    const user = await getUserById(id)
    if (!user) {
      throw new Error('You are not allowed to do that.')
    }

    req.user = user
    next()
  } catch (error) {
    next({
      status: 401,
      response: error.message
    })
  }
}
