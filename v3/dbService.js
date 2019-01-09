const env = process.env.NODE_ENV || 'development'
const config = require('../ipfs-cache/knexfile')[env]
const db = require('knex')(config)

module.exports = db