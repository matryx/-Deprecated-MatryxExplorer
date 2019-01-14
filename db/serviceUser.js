const Joi = require('joi')
const db = require('./index')

const selectUser = () => {
  return db('user').select('id', 'web3_address', 'email')
}

module.exports = {
  async getUserById(id) {
    const userId = Joi.attempt(id, Joi.number());
    const users = await selectUser().where({ id: userId })
    return users[0] || null
  },

  async getWeb3User(address) {
    const valid = Joi.attempt(address, Joi.string().trim().length(42))
    const web3_address = valid.toLowerCase()

    const existingUsers = await selectUser().where({ web3_address })
    if (existingUsers.length) {
      return existingUsers[0]
    }

    // Create the user then return the infos
    await db('user').insert({ web3_address })
    const newUsers = await selectUser().where({ web3_address })
    return newUsers[0]
  },
}
