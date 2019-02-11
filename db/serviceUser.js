const Joi = require('joi')
const db = require('./index')

function validate(input, schema) {
  return Joi.attempt(input, schema, { abortEarly: false })
}

const validEthAddress = Joi.string().trim().regex(/^0x[0-9A-Fa-f]{40}$/)

const selectUser = (columns = ['id', 'eth_address', 'email']) => {
  return db('user').select(columns)
}

module.exports = {
  async getUserById(id) {
    const userId = validate(id, Joi.number());
    const users = await selectUser().where({ id: userId })
    return users[0] || null
  },

  async getWeb3User(address) {
    const valid = validate(address, validEthAddress)
    const eth_address = valid.toLowerCase()

    const existingUsers = await selectUser().where({ eth_address })
    if (existingUsers.length) {
      return existingUsers[0]
    }

    // Create the user then return the infos
    await db('user').insert({ eth_address })
    const newUsers = await selectUser().where({ eth_address })
    return newUsers[0]
  },

  async updateUser(params) {
    const { id, updates } = validate(params, {
      id: Joi.number().required(),
      updates: Joi.object().keys({
        email: Joi.string().trim().email().valid('', null).empty('').default('')
      })
    })

    await db('user').where({ id }).update(updates)
    const users = await selectUser().where({ id })
    return users[0]
  },
}
